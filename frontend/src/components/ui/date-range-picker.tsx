import { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

type Props = {
    value: { start: Date; end: Date } | null;
    onChange: (range: { start: Date; end: Date } | null) => void;
};

export const DateRangePicker = ({ value, onChange }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
        if (range?.from && range?.to) {
            onChange({ start: range.from, end: range.to });
            setIsOpen(false);
        }
    };

    const formattedRange =
        value?.start && value?.end
            ? `${format(value.start, 'MMM dd, yyyy')} - ${format(value.end, 'MMM dd, yyyy')}`
            : 'Select Date Range';

    return (
        <div className="relative w-full max-w-xs">
            <button
                onClick={() => setIsOpen((open) => !open)}
                className="w-full rounded-md border px-3 py-2 text-sm text-left shadow-sm bg-white"
            >
                {formattedRange}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 bg-white border rounded-md shadow-lg">
                    <DayPicker
                        mode="range"
                        selected={value ? { from: value.start, to: value.end } : undefined}
                        onSelect={handleSelect}
                        defaultMonth={value?.start ?? new Date()}
                        numberOfMonths={1}
                    />
                </div>
            )}
        </div>
    );
};
