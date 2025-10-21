'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, checkSession } from '@/lib/auth';
import { api, Order, User } from '@/lib/types';
import { motion } from 'framer-motion';
import {
  LogOut,
  Search,
  Plus,
  Package,
  Users,
  Moon,
  Sun,
  Edit,
  MessageSquare,
} from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !checkSession()) {
      router.push('/admin/login');
      return;
    }

    if (currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchData(true); // Initial load with loading state

    // Poll for updates every 10 seconds (background refresh)
    const interval = setInterval(() => {
      fetchData(false); // Background refresh without loading state
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchData = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      // Fetch all orders
      const ordersResponse = await api.get('/orders');
      if (ordersResponse.success) {
        // Fetch user details for each order
        const ordersWithUsers = await Promise.all(
          ordersResponse.data.map(async (order: any) => {
            try {
              const userResponse = await api.get(`/users`);
              const user = userResponse.data.find((u: any) => u.id === order.user_id);
              return { ...order, users: user };
            } catch {
              return { ...order, users: null };
            }
          })
        );
        setOrders(ordersWithUsers);
      }

      // Fetch all customers
      const usersResponse = await api.get('/users?role=user');
      if (usersResponse.success) {
        setCustomers(usersResponse.data);
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
    router.push('/admin/login');
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.users?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-temple-gold mx-auto"></div>
          <p className="mt-4 text-temple-gold font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-temple-gold">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage orders and customers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-temple-gold transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="temple-card dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {orders.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="temple-card dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Orders</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {orders.filter((o) => o.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="temple-card dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {customers.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="temple-card dark:bg-gray-800 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, order ID, or product..."
                className="temple-input pl-12 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="temple-input dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => router.push('/admin/add-user')}
              className="temple-button flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="temple-card dark:bg-gray-800"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            All Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                    Stage
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-800 dark:text-white font-mono text-sm">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-white">
                      {order.users?.name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-white">
                      {order.product_name}
                    </td>
                    <td className="py-3 px-4 text-gray-800 dark:text-white">
                      Stage {order.current_stage}/5
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : order.status === 'completed'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="p-2 text-temple-gold hover:bg-gold-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/chat/${order.user_id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          title="Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No orders found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
