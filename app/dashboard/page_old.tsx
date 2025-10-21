'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, checkSession } from '@/lib/auth';
import { api, Order, ProcessUpdate, Bill } from '@/lib/types';
import { motion } from 'framer-motion';
import { LogOut, Package, FileText, Truck, Sparkles, Copy, Check } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import StageCard from '@/components/StageCard';
import ChatBox from '@/components/ChatBox';
import { PROCESS_STAGES } from '@/lib/constants';
import Image from 'next/image';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [processUpdates, setProcessUpdates] = useState<ProcessUpdate[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !checkSession()) {
      router.push('/login');
      return;
    }

    if (currentUser.role === 'admin') {
      router.push('/admin');
      return;
    }

    setUser(currentUser);
    fetchData(currentUser.id, true); // Initial load with loading state
    fetchAdminId();

    // Poll for updates every 10 seconds (background refresh)
    const interval = setInterval(() => {
      fetchData(currentUser.id, false); // Background refresh without loading state
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  const fetchAdminId = async () => {
    try {
      const response = await api.get('/users?role=admin');
      if (response.success && response.data.length > 0) {
        setAdminId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch admin ID:', error);
    }
  };

  const fetchData = async (userId: string, showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      // Fetch order
      const orderResponse = await api.get(`/orders?user_id=${userId}`);
      
      if (orderResponse.success && orderResponse.data.length > 0) {
        const orderData = orderResponse.data[0];
        setOrder(orderData);

        // Fetch process updates
        const processResponse = await api.get(`/process-updates?order_id=${orderData.id}`);
        if (processResponse.success) {
          setProcessUpdates(processResponse.data);
        }

        // Fetch bills
        const billsResponse = await api.get(`/bills?order_id=${orderData.id}`);
        if (billsResponse.success) {
          setBills(billsResponse.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }

    if (showLoading) {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCopyTrackingId = async () => {
    if (order?.courier_id) {
      try {
        await navigator.clipboard.writeText(order.courier_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="temple-card text-center max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Orders</h2>
          <p className="text-gray-600 mb-6">
            You don't have any active orders at the moment. Please contact our team to place an order.
          </p>
          <button onClick={handleLogout} className="temple-button">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-temple-gold to-temple-darkGold p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-temple-gold">Welcome, {user?.name}</h1>
              <p className="text-gray-600">Track your custom jewellery order</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-temple-gold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </motion.div>

        {/* Order Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="temple-card mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{order.product_name}</h2>
              <p className="text-gray-600">Order ID: #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {order.status.toUpperCase()}
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar currentStage={order.current_stage} />
        </motion.div>

        {/* Process Stages */}
        <div className="grid gap-6 mb-8">
          {PROCESS_STAGES.map((stage, index) => {
            const processUpdate = processUpdates.find((p) => p.stage_number === stage.id);
            const status =
              stage.id < order.current_stage
                ? 'completed'
                : stage.id === order.current_stage
                ? 'in_progress'
                : 'pending';

            return (
              <StageCard
                key={stage.id}
                stageNumber={stage.id}
                stageName={stage.name}
                stageDescription={stage.description}
                status={status}
                photoUrl={processUpdate?.photo_url}
                currentStage={order.current_stage}
                processUpdates={processUpdates}
              />
            );
          })}
        </div>

        {/* Advance Bill Section */}
        {bills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="temple-card mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-temple-gold" />
              <h3 className="text-xl font-bold text-gray-800">Advance Payment Bills</h3>
            </div>
            <div className="grid gap-4">
              {bills.map((bill) => (
                <a
                  key={bill.id}
                  href={bill.bill_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gold-50 rounded-lg hover:bg-gold-100 transition-colors"
                >
                  <FileText className="w-5 h-5 text-temple-gold" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">View Bill</p>
                    <p className="text-sm text-gray-600">
                      Uploaded on {new Date(bill.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-temple-gold font-semibold">View →</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Courier Tracking Section */}
        {order.courier_id && order.courier_link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="temple-card mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-temple-gold" />
              <h3 className="text-xl font-bold text-gray-800">Courier Tracking</h3>
            </div>
            <div className="bg-gold-50 rounded-lg p-6">
              <p className="text-gray-600 mb-2">Tracking ID</p>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-2xl font-bold text-temple-gold font-mono">{order.courier_id}</p>
                <button
                  onClick={handleCopyTrackingId}
                  className="p-2 hover:bg-gold-100 rounded-lg transition-colors group relative"
                  title="Copy Tracking ID"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-temple-gold group-hover:text-temple-darkGold" />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={order.courier_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="temple-button inline-flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Track Package
                </a>
                {copied && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Copied to clipboard!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chat Box */}
      {adminId && <ChatBox orderId={order.id} adminId={adminId} />}
    </div>
  );
}
