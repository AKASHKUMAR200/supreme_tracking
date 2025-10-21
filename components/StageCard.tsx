'use client';

import { motion } from 'framer-motion';
import { Image as ImageIcon, CheckCircle2, Clock, Circle } from 'lucide-react';
import Image from 'next/image';
import { ProcessUpdate } from '@/lib/types';
import { shouldShowPhotos } from '@/lib/constants';

interface StageCardProps {
  stageNumber: number;
  stageName: string;
  stageDescription: string;
  status: 'pending' | 'in_progress' | 'completed';
  photoUrl?: string | null;
  currentStage: number;
  processUpdates: ProcessUpdate[];
}

export default function StageCard({
  stageNumber,
  stageName,
  stageDescription,
  status,
  photoUrl,
  currentStage,
  processUpdates,
}: StageCardProps) {
  const showPhotos = shouldShowPhotos(stageNumber, currentStage, processUpdates);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-blue-600 animate-pulse" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    const badges = {
      pending: 'stage-badge-pending',
      in_progress: 'stage-badge-in-progress',
      completed: 'stage-badge-completed',
    };
    return badges[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="temple-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Stage {stageNumber}: {stageName}
            </h3>
            <p className="text-sm text-gray-600">{stageDescription}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge()}`}>
          {status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Photo Display */}
      {showPhotos && photoUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4 rounded-lg overflow-hidden border-2 border-gold-200"
        >
          <Image
            src={photoUrl}
            alt={`${stageName} progress`}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
        </motion.div>
      )}

      {showPhotos && !photoUrl && status !== 'pending' && (
        <div className="mt-4 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Photo will be uploaded soon</p>
        </div>
      )}
    </motion.div>
  );
}
