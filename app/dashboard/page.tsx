'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, checkSession } from '@/lib/auth';
import { api, Order, ProcessUpdate, Bill } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  LogOut,
  Package,
  FileText,
  Truck,
  Copy,
  Check,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  User,
  Search,
  Filter,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import ChatBox from '@/components/ChatBox';
import { PROCESS_STAGES, shouldShowPhotos } from '@/lib/constants';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processUpdates, setProcessUpdates] = useState<Record<string, ProcessUpdate[]>>({});
  const [bills, setBills] = useState<Record<string, Bill[]>>({});
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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
    fetchAllOrders(currentUser.id, true);
    fetchAdminId();

    const interval = setInterval(() => {
      fetchAllOrders(currentUser.id, false);
    }, 15000);

    return () => clearInterval(interval);
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

  const fetchAllOrders = async (userId: string, showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const orderResponse = await api.get(`/orders?user_id=${userId}`);
      
      if (orderResponse.success && orderResponse.data.length > 0) {
        const ordersData = orderResponse.data;
        setOrders(ordersData);

        // Fetch details for all orders
        const processUpdatesMap: Record<string, ProcessUpdate[]> = {};
        const billsMap: Record<string, Bill[]> = {};

        await Promise.all(
          ordersData.map(async (order: Order) => {
            try {
              const processResponse = await api.get(`/process-updates?order_id=${order.id}`);
              if (processResponse.success) {
                processUpdatesMap[order.id] = processResponse.data;
              }

              const billsResponse = await api.get(`/bills?order_id=${order.id}`);
              if (billsResponse.success) {
                billsMap[order.id] = billsResponse.data;
              }
            } catch (error) {
              console.error(`Failed to fetch details for order ${order.id}:`, error);
            }
          })
        );

        setProcessUpdates(processUpdatesMap);
        setBills(billsMap);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }

    if (showLoading) setLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCopyTrackingId = async (trackingId: string) => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(trackingId);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getProgressPercentage = (stage: number) => (stage / 5) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gray-900 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Supreme Temple Jewellery</h1>
            <div className="flex items-center space-x-4">
              <a
                href="https://supremetemplejewellery.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy More</span>
                <Sparkles className="w-3 h-3" />
              </a>
              <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders. Contact us to start your custom jewellery journey.</p>
          <a
            href="https://supremetemplejewellery.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Browse Our Collection</span>
            <Sparkles className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Amazon-like Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">Supreme Temple Jewellery</h1>
              <nav className="hidden md:flex items-center space-x-6 text-sm">
                <span className="font-semibold border-b-2 border-orange-500 pb-1">Your Orders</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4" />
                <span>Hello, {user?.name}</span>
              </div>
              <a
                href="https://supremetemplejewellery.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded font-semibold text-sm transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy More</span>
                <Sparkles className="w-3 h-3" />
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
                <p className="text-orange-100 text-lg">Track your custom jewellery orders in real-time</p>
              </div>
              <div className="hidden md:block">
                <Sparkles className="w-24 h-24 text-orange-200 opacity-50" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">In Progress</p>
                <p className="text-4xl font-bold text-gray-900">{orders.filter(o => o.status === 'active').length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Completed</p>
                <p className="text-4xl font-bold text-gray-900">{orders.filter(o => o.status === 'completed').length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Page Title & Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Orders</h2>
            <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-semibold">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white transition-all"
                >
                  <option value="all">All Orders</option>
                  <option value="active">Active Orders</option>
                  <option value="completed">Completed Orders</option>
                  <option value="cancelled">Cancelled Orders</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const orderProcessUpdates = processUpdates[order.id] || [];
            const orderBills = bills[order.id] || [];
            const currentStage = PROCESS_STAGES.find(s => s.id === order.current_stage);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-orange-300 transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-6 py-4 border-b-2 border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 text-xs uppercase mb-1">Order Placed</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase mb-1">Order ID</p>
                      <p className="font-medium text-gray-900">#{order.id.slice(0, 12).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs uppercase mb-1">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status === 'active' && <Clock className="w-3 h-3 mr-1" />}
                        {order.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.status === 'cancelled' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  {/* Product Info */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Package className="w-12 h-12 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{order.product_name}</h3>
                      <div className="flex items-center space-x-4 text-sm mb-3">
                        <span className="flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                          <MapPin className="w-4 h-4 mr-1" />
                          Stage {order.current_stage} of 5
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                          {currentStage?.name}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-gray-700">Production Progress</span>
                          <span className="text-lg font-bold text-orange-600">
                            {Math.round(getProgressPercentage(order.current_stage))}%
                          </span>
                        </div>
                        <div className="relative w-full bg-gray-200 rounded-full h-4 shadow-inner">
                          <div
                            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${getProgressPercentage(order.current_stage)}%` }}
                          >
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"></div>
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-semibold text-gray-600">
                          <span>Started</span>
                          <span>In Progress</span>
                          <span>Completed</span>
                        </div>
                      </div>

                      {/* Courier Tracking */}
                      {order.courier_id && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <p className="font-semibold text-green-900 mb-1">Package Shipped</p>
                                <p className="text-sm text-green-700 mb-2">Tracking ID: <span className="font-mono font-semibold">{order.courier_id}</span></p>
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleCopyTrackingId(order.courier_id!)}
                                    className="flex items-center space-x-1 text-sm text-green-700 hover:text-green-900 font-medium"
                                  >
                                    {copied === order.courier_id ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                  {order.courier_link && (
                                    <a
                                      href={order.courier_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center space-x-1 text-sm text-green-700 hover:text-green-900 font-medium"
                                    >
                                      <span>Track Package</span>
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Photo Gallery Preview */}
                      {orderProcessUpdates.filter(u => u.photo_url && shouldShowPhotos(u.stage_number, order.current_stage, orderProcessUpdates)).length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Production Photos ({orderProcessUpdates.filter(u => u.photo_url && shouldShowPhotos(u.stage_number, order.current_stage, orderProcessUpdates)).length})</p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {orderProcessUpdates
                              .filter(u => u.photo_url && shouldShowPhotos(u.stage_number, order.current_stage, orderProcessUpdates))
                              .slice(0, 4)
                              .map((update, idx) => (
                                <div key={idx} className="flex-shrink-0">
                                  <img
                                    src={update.photo_url || ''}
                                    alt={`Stage ${update.stage_number}`}
                                    className="w-20 h-20 object-cover rounded border-2 border-gray-300 hover:border-orange-500 cursor-pointer transition-all"
                                    onClick={() => setSelectedOrder(order)}
                                  />
                                </div>
                              ))}
                            {orderProcessUpdates.filter(u => u.photo_url && shouldShowPhotos(u.stage_number, order.current_stage, orderProcessUpdates)).length > 4 && (
                              <div className="w-20 h-20 bg-gray-100 rounded border-2 border-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                                +{orderProcessUpdates.filter(u => u.photo_url && shouldShowPhotos(u.stage_number, order.current_stage, orderProcessUpdates)).length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium text-sm transition-colors"
                        >
                          {selectedOrder?.id === order.id ? 'Hide Details' : 'View Production Stages'}
                        </button>
                        {orderBills.length > 0 && (
                          <a
                            href={orderBills[0].bill_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded font-medium text-sm transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Bill</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOrder?.id === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-6 mt-6"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Production Stages</h4>
                      
                      {/* Stage Timeline */}
                      <div className="space-y-4">
                        {PROCESS_STAGES.map((stage, idx) => {
                          const stageUpdate = orderProcessUpdates.find(p => p.stage_number === stage.id);
                          const isCompleted = stage.id < order.current_stage;
                          const isCurrent = stage.id === order.current_stage;
                          const isPending = stage.id > order.current_stage;

                          return (
                            <div key={stage.id} className="flex">
                              {/* Timeline Line */}
                              <div className="flex flex-col items-center mr-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted ? 'bg-green-500' :
                                  isCurrent ? 'bg-orange-500' :
                                  'bg-gray-300'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                  ) : (
                                    <span className="text-white font-semibold text-sm">{stage.id}</span>
                                  )}
                                </div>
                                {idx < PROCESS_STAGES.length - 1 && (
                                  <div className={`w-0.5 h-16 ${
                                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                  }`} />
                                )}
                              </div>

                              {/* Stage Content */}
                              <div className="flex-1 pb-8">
                                <div className={`p-4 rounded-lg border ${
                                  isCurrent ? 'bg-orange-50 border-orange-200' :
                                  isCompleted ? 'bg-green-50 border-green-200' :
                                  'bg-gray-50 border-gray-200'
                                }`}>
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h5 className="font-semibold text-gray-900">{stage.name}</h5>
                                      <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                                    </div>
                                    {isCurrent && (
                                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                                        Current
                                      </span>
                                    )}
                                    {isCompleted && (
                                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                                        Completed
                                      </span>
                                    )}
                                  </div>

                                  {/* Stage Photo */}
                                  {stageUpdate?.photo_url && shouldShowPhotos(stage.id, order.current_stage, orderProcessUpdates) && (
                                    <div className="mt-4">
                                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Stage Photo</p>
                                      <div className="relative group">
                                        <img
                                          src={stageUpdate.photo_url}
                                          alt={`${stage.name} photo`}
                                          className="w-full max-w-2xl h-64 object-cover rounded-lg border-2 border-gray-300 shadow-md hover:shadow-xl transition-all cursor-pointer"
                                          onClick={() => window.open(stageUpdate.photo_url || '', '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                                          <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-2">Click to view full size</p>
                                    </div>
                                  )}
                                  
                                  {/* No Photo Message */}
                                  {!stageUpdate?.photo_url && (isCompleted || isCurrent) && (
                                    <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
                                      <p className="text-sm text-gray-600 italic">Photo will be uploaded soon</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bills Section */}
                      {orderBills.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Bills</h4>
                          <div className="space-y-3">
                            {orderBills.map((bill) => (
                              <a
                                key={bill.id}
                                href={bill.bill_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  <div>
                                    <p className="font-semibold text-gray-900">Advance Payment Bill</p>
                                    <p className="text-sm text-gray-600">
                                      {new Date(bill.created_at).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-blue-600">
                                  <Download className="w-5 h-5" />
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Developed by <span className="font-semibold text-gray-900">SUPREME GROUPS NGL</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} Supreme Temple Jewellery. All rights reserved.
          </p>
        </div>
      </div>

      {/* Chat Box */}
      {adminId && selectedOrder && <ChatBox orderId={selectedOrder.id} adminId={adminId} />}
    </div>
  );
}
