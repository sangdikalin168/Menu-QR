import React, { useState, useEffect, useRef } from 'react';
import { QrCodeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface BarcodeScannerInputProps {
    onScan: (barcode: string) => void;
    onError?: (error: string) => void;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const BarcodeScannerInput: React.FC<BarcodeScannerInputProps> = ({
    onScan,
    onError,
    disabled = false,
    placeholder = 'Scan barcode or enter manually',
    className = '',
}) => {
    const [barcode, setBarcode] = useState('');
    const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [scanTimeout, setScanTimeout] = useState<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Handle barcode scanning logic
    useEffect(() => {
        if (barcode.length === 0) return;

        // Clear any existing timeout
        if (scanTimeout) {
            clearTimeout(scanTimeout);
        }

        // Set scanning state
        setScanStatus('scanning');

        // Wait for scanning to complete (no new characters for 100ms)
        const timeout = setTimeout(() => {
            handleBarcodeComplete(barcode);
        }, 100);

        setScanTimeout(timeout);

        return () => {
            if (scanTimeout) {
                clearTimeout(scanTimeout);
            }
        };
    }, [barcode]);

    const handleBarcodeComplete = (scannedBarcode: string) => {
        try {
            // Validate barcode (basic validation)
            if (!scannedBarcode || scannedBarcode.trim().length === 0) {
                throw new Error('Invalid barcode');
            }

            // Process the barcode
            onScan(scannedBarcode);
            setScanStatus('success');

            // Clear after success
            setTimeout(() => {
                setBarcode('');
                setScanStatus('idle');
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 200);
        } catch (error) {
            setScanStatus('error');
            onError?.(error instanceof Error ? error.message : 'Failed to scan barcode');

            // Keep the barcode visible for correction
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Prevent form submission on Enter
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBarcodeComplete(barcode);
        }
    };

    const getStatusClasses = () => {
        switch (scanStatus) {
            case 'scanning':
                return 'border-blue-500 ring-1 ring-blue-500';
            case 'success':
                return 'border-green-500 ring-1 ring-green-500';
            case 'error':
                return 'border-red-500 ring-1 ring-red-500';
            default:
                return 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';
        }
    };

    const getStatusIcon = () => {
        switch (scanStatus) {
            case 'success':
                return <CheckIcon className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XMarkIcon className="h-5 w-5 text-red-500" />;
            default:
                return <QrCodeIcon className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            <div className="relative rounded-md shadow-sm">
                <input
                    ref={inputRef}
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoFocus
                    className={`block w-full rounded-md py-2 pl-3 pr-10 text-base outline-none transition-all sm:text-sm ${getStatusClasses()} ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                        }`}
                    aria-label="Barcode scanner input"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getStatusIcon()}
                </div>
            </div>

            {/* {scanStatus === 'success' && (
                <p className="text-sm text-green-600">Barcode scanned successfully!</p>
            )}
            {scanStatus === 'error' && (
                <p className="text-sm text-red-600">Invalid barcode. Please try again.</p>
            )} */}
        </div>
    );
};