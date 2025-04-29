import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
      <p className="text-gray-600 dark:text-white text-6xl">No modules found</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Get started by creating a new module.</p>
    </div>
  );
};

export default EmptyState;
