import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="text-gray-700 dark:text-white text-lg">Loading saved commands...</p>
        </div>
    );
};

export default LoadingSpinner;
