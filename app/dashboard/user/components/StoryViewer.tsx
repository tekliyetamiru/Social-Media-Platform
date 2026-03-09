'use client';

interface StoryViewerProps {
  stories: any[];
  initialIndex: number;
  onClose: () => void;
  onComplete: () => void;
}

export function StoryViewer({ stories, initialIndex, onClose, onComplete }: StoryViewerProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-lg">
        <p className="text-white text-center">Story viewer coming soon...</p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}