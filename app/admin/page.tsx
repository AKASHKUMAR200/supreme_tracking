'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, checkSession } from '@/lib/auth';
import { api } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Search,
  Plus,
  Package,
  Users,
  Edit,
  MessageSquare,
  Trash2,
  Eye,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Receipt,
  ExternalLink,
  MessageCircle,
  Phone,
} from 'lucide-react';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'customers'>('orders');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
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
    fetchData(true);

    const interval = setInterval(() => {
      fetchData(false);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  const fetchData = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const [ordersResponse, usersResponse] = await Promise.all([
        api.get('/orders'),
        api.get('/users?role=user'),
      ]);

      if (ordersResponse.success) {
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

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const response = await api.delete(`/users?id=${customerId}`);
      if (response.success) {
        fetchData(false);
        setDeleteConfirm(null);
        alert('Customer deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleSendCredentials = (customer: any) => {
    // Generate WhatsApp URL with customer credentials
    const message = `💎 Welcome to SUPREME TEMPLE JEWELLERY – NGL! 💎\n\nHi there! 👋\n\nYour account has been created to track your custom jewellery order in real-time ✨\n\nHere are your login details 👇\n🔹 User ID: ${customer.mobile_number}\n🔹 Password: ${customer.password || customer.mobile_number}\n🔹 Login Link: ${window.location.origin}\n\nYou can now view live updates, photos, and progress of your jewellery as it's being crafted by our artisans 👑\n\nThank you for choosing SUPREME TEMPLE JEWELLERY – Where Craftsmanship Meets Divinity! 🙏\n\n— Team SUPREME GROUPS NGL`;

    const whatsappUrl = `https://wa.me/${customer.mobile_number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.users?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.mobile_number?.includes(searchQuery)
  );

  // Statistics
  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => o.status === 'active').length,
    completedOrders: orders.filter((o) => o.status === 'completed').length,
    totalCustomers: customers.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Supreme Jewellery</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <a
                href="https://supremebilling.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                title="Open Billing Application"
              >
                <Receipt className="w-4 h-4" />
                <span className="text-sm font-medium hidden md:inline">Billing App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => fetchData(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.activeOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalCustomers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {orders.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'customers'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Customers</span>
                  <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs">
                    {customers.length}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {activeTab === 'orders' && (
                  <>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => router.push('/admin/add-order')}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Order</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => router.push('/admin/add-user')}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Add Customer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'orders' ? (
              <OrdersTable orders={filteredOrders} router={router} />
            ) : (
              <CustomersTable
                customers={filteredCustomers}
                router={router}
                onDelete={(id: string) => setDeleteConfirm(id)}
                onSendCredentials={handleSendCredentials}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Developed by <span className="font-semibold text-blue-600">Supreme Info Tech</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">© 2024 Supreme Temple Jewellery. All rights reserved.</p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this customer? All associated orders, messages, and data will be permanently removed.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCustomer(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Orders Table Component
function OrdersTable({ orders, router }: any) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stage</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, index: number) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <span className="text-sm font-mono text-gray-600">
                  #{order.id?.slice(0, 8).toUpperCase()}
                </span>
              </td>
              <td className="py-4 px-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.users?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{order.users?.mobile_number}</p>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-900">{order.product_name}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-medium text-blue-600">Stage {order.current_stage}/5</span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    order.status === 'active'
                      ? 'bg-orange-100 text-orange-700'
                      : order.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    title="Manage Order"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/admin/chat/${order.user_id}`)}
                    className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                    title="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Customers Table Component
function CustomersTable({ customers, router, onDelete, onSendCredentials }: any) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mobile</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer: any, index: number) => (
            <motion.tr
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {customer.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">{customer.mobile_number}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {new Date(customer.created_at).toLocaleDateString()}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => router.push(`/admin/chat/${customer.id}`)}
                    className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                    title="Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSendCredentials(customer)}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                    title="Send Login Credentials via WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
