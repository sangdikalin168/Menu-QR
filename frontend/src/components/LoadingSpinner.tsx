import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-12">
            <div className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;