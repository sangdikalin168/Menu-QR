// src/components/ui/LoadingPage.tsx
import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                {/* Spinner */}
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mb-4"></div>
                {/* Message */}
                <p className="text-lg text-gray-700">សូមរងចាំ...</p>
            </div>
        </div>
    );
};

export default LoadingPage;