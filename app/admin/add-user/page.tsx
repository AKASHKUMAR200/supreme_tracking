'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { api } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';

export default function AddUserPage() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [productName, setProductName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // Create user
      const userResponse = await api.post('/users', {
        name,
        mobile_number: mobileNumber,
        password,
        role: 'user',
      });

      if (!userResponse.success) {
        setError(userResponse.error || 'Failed to create user');
        setSaving(false);
        return;
      }

      const newUser = userResponse.data;

      // Create order for the user
      const orderResponse = await api.post('/orders', {
        user_id: newUser.id,
        product_name: productName,
        current_stage: 1,
        status: 'active',
      });

      if (!orderResponse.success) {
        setError('User created but failed to create order');
        setSaving(false);
        return;
      }

      const newOrder = orderResponse.data;

      // Initialize process updates
      const processUpdates = [1, 2, 3, 4, 5];
      for (const stageNumber of processUpdates) {
        await api.post('/process-updates', {
          order_id: newOrder.id,
          stage_number: stageNumber,
          status: stageNumber === 1 ? 'in_progress' : 'pending',
        });
      }

      alert('User and order created successfully!');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.push('/admin')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-temple-gold">Add New User</h1>
            <p className="text-gray-600">Create a new customer and order</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="temple-card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
                className="temple-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                className="temple-input"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be used as both username and password for login
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: mobile number)"
                className="temple-input"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can set a custom password or use the mobile number
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product/jewellery name"
                className="temple-input"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="temple-button-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="temple-button flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5" />
                {saving ? 'Creating...' : 'Create User & Order'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
