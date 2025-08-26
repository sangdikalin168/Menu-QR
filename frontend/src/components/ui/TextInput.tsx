import React from 'react';

interface TextInputProps {
    label?: string;
    id: string;
    name: string;
    type?: 'text' | 'email' | 'number' | 'tel' | 'search';
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    required?: boolean;
    autoComplete?: string;
    className?: string
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    id,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    autoComplete,
    className = "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div>
                <input
                    id={id}
                    name={name}
                    type={type}
                    required={required}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={className}
                />
            </div>
        </div>
    );
};