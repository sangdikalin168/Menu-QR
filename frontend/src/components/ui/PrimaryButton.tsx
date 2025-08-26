import React from 'react';

interface PrimaryButtonProps {
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    type = 'button',
    className = '',
    onClick,
    disabled = false,
    fullWidth = true,
    children,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex w-${fullWidth ? 'full' : 'auto'} justify-center rounded-md
                bg-indigo-600 px-2 py-1.5 text-sm  text-white
                shadow-xs hover:bg-indigo-500
                focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600
                disabled:opacity-70 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
};