'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { api, Order, ProcessUpdate } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save, Truck, FileText, Image as ImageIcon } from 'lucide-react';
import { PROCESS_STAGES } from '@/lib/constants';

export default function OrderManagementPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [processUpdates, setProcessUpdates] = useState<ProcessUpdate[]>([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [courierId, setCourierId] = useState('');
  const [courierLink, setCourierLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchOrderData();
  }, [orderId, router]);

  const fetchOrderData = async () => {
    try {
      const orderResponse = await api.get(`/orders/${orderId}`);
      if (orderResponse.success) {
        setOrder(orderResponse.data);
        setCurrentStage(orderResponse.data.current_stage);
        setCourierId(orderResponse.data.courier_id || '');
        setCourierLink(orderResponse.data.courier_link || '');
      }

      const processResponse = await api.get(`/process-updates?order_id=${orderId}`);
      if (processResponse.success && processResponse.data.length > 0) {
        setProcessUpdates(processResponse.data);
      } else {
        // Initialize process updates if they don't exist
        for (const stage of PROCESS_STAGES) {
          await api.post('/process-updates', {
            order_id: orderId,
            stage_number: stage.id,
            status: 'pending',
          });
        }
        // Refetch after initialization
        const newProcessResponse = await api.get(`/process-updates?order_id=${orderId}`);
        if (newProcessResponse.success) {
          setProcessUpdates(newProcessResponse.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch order data:', error);
    }
  };

  const handlePhotoUpload = async (stageNumber: number, file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'process-photos');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const processUpdate = processUpdates.find((p) => p.stage_number === stageNumber);

        if (processUpdate) {
          await api.put('/process-updates', {
            id: processUpdate.id,
            photo_url: `/api/files?fileId=${result.fileId}`,
          });
        }

        fetchOrderData();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }

    setUploading(false);
  };

  const handleBillUpload = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'bills');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        await api.post('/bills', {
          order_id: orderId,
          bill_url: `/api/files?fileId=${result.fileId}`,
        });
        alert('Bill uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }

    setUploading(false);
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
      // Update order
      await api.put(`/orders/${orderId}`, {
        current_stage: currentStage,
        courier_id: courierId || null,
        courier_link: courierLink || null,
      });

      // Update process statuses
      for (const update of processUpdates) {
        const status =
          update.stage_number < currentStage
            ? 'completed'
            : update.stage_number === currentStage
            ? 'in_progress'
            : 'pending';

        await api.put('/process-updates', {
          id: update.id,
          status,
        });
      }

      alert('Changes saved successfully!');
      fetchOrderData();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }

    setSaving(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-temple-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-temple-gold">Manage Order</h1>
            <p className="text-gray-600">Order ID: #{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="temple-card mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>
              <p className="text-gray-800">{order.product_name}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Stage
              </label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(parseInt(e.target.value))}
                className="temple-input"
              >
                {PROCESS_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    Stage {stage.id}: {stage.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Process Stages */}
        <div className="space-y-6 mb-6">
          {PROCESS_STAGES.map((stage) => {
            const processUpdate = processUpdates.find((p) => p.stage_number === stage.id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stage.id * 0.1 }}
                className="temple-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Stage {stage.id}: {stage.name}
                    </h3>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Photo
                  </label>
                  {processUpdate?.photo_url ? (
                    <div className="relative">
                      <img
                        src={processUpdate.photo_url}
                        alt={`Stage ${stage.id}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <label className="absolute top-2 right-2 cursor-pointer bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100">
                        <Upload className="w-5 h-5 text-temple-gold" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(stage.id, file);
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(stage.id, file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Courier Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="temple-card mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-temple-gold" />
            <h3 className="text-xl font-bold text-gray-800">Courier Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Courier Tracking ID
              </label>
              <input
                type="text"
                value={courierId}
                onChange={(e) => setCourierId(e.target.value)}
                placeholder="Enter tracking ID"
                className="temple-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tracking Link
              </label>
              <input
                type="url"
                value={courierLink}
                onChange={(e) => setCourierLink(e.target.value)}
                placeholder="Enter tracking URL"
                className="temple-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Bill Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="temple-card mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-temple-gold" />
            <h3 className="text-xl font-bold text-gray-800">Upload Advance Bill</h3>
          </div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload bill (PDF or Image)</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBillUpload(file);
              }}
            />
          </label>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSaveChanges}
            disabled={saving || uploading}
            className="temple-button flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
