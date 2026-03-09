'use client';

interface CreateStoryProps {
  onClose: () => void;
  onStoryCreated: () => void;
}

export function CreateStory({ onClose, onStoryCreated }: CreateStoryProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Create Story</h2>
        <p>Story creation coming soon...</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}