'use client';

import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { PROCESS_STAGES } from '@/lib/constants';

interface ProgressBarProps {
  currentStage: number;
}

export default function ProgressBar({ currentStage }: ProgressBarProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStage - 1) / (PROCESS_STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-temple-gold to-temple-darkGold"
          />
        </div>

        {/* Stage Circles */}
        {PROCESS_STAGES.map((stage, index) => {
          const stageNumber = index + 1;
          const isCompleted = stageNumber < currentStage;
          const isCurrent = stageNumber === currentStage;
          const isPending = stageNumber > currentStage;

          return (
            <div key={stage.id} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-4 
                  ${isCompleted ? 'bg-temple-gold border-temple-gold' : ''}
                  ${isCurrent ? 'bg-white border-temple-gold animate-pulse' : ''}
                  ${isPending ? 'bg-white border-gray-300' : ''}
                  transition-all duration-300
                `}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <Circle
                    className={`w-6 h-6 ${isCurrent ? 'text-temple-gold' : 'text-gray-400'}`}
                    fill={isCurrent ? 'currentColor' : 'none'}
                  />
                )}
              </motion.div>
              <p
                className={`
                  mt-2 text-xs font-semibold text-center max-w-[80px]
                  ${isCompleted || isCurrent ? 'text-temple-gold' : 'text-gray-400'}
                `}
              >
                {stage.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
