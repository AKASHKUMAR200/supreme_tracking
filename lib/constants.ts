export const PROCESS_STAGES = [
  {
    id: 1,
    name: 'Design Phase',
    description: 'Creating the initial design and blueprint',
  },
  {
    id: 2,
    name: 'Casting Phase',
    description: 'Casting the metal into the desired shape',
  },
  {
    id: 3,
    name: 'Polishing Phase',
    description: 'Polishing and refining the surface',
  },
  {
    id: 4,
    name: 'Stone Setting',
    description: 'Setting precious stones and gems',
  },
  {
    id: 5,
    name: 'Final Delivery',
    description: 'Quality check and packaging',
  },
];

export const getStageStatus = (currentStage: number, stageNumber: number): 'pending' | 'in_progress' | 'completed' => {
  if (stageNumber < currentStage) return 'completed';
  if (stageNumber === currentStage) return 'in_progress';
  return 'pending';
};

// Photo visibility logic:
// When Process N is in progress → Process N-1 photos are still visible
// Once Process N is completed → Process N-1 photos disappear
export const shouldShowPhotos = (
  stageNumber: number,
  currentStage: number,
  processUpdates: any[]
): boolean => {
  // If this is the current stage or a future stage, show photos if they exist
  if (stageNumber >= currentStage) {
    return true;
  }

  // For completed stages, only show if the next stage is still in progress
  if (stageNumber === currentStage - 1) {
    // Check if current stage is completed
    const currentStageUpdate = processUpdates.find(
      (update) => update.stage_number === currentStage
    );
    if (currentStageUpdate?.status === 'completed') {
      return false; // Hide previous stage photos
    }
    return true; // Current stage in progress, show previous photos
  }

  // For older stages, hide photos
  return false;
};
