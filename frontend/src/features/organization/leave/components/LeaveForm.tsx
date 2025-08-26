import React from 'react';
import { Input } from '@/components/ui/input';

type LeaveItem = {
    id?: string;
    employee_id?: string;
    leave_type?: string;
    start_time?: string;
    end_time?: string;
    leave_day?: number;
    duration?: 'FULL' | 'HALF_AM' | 'HALF_PM';
    reason?: string;
};

type Employee = { id: string; emp_code?: string; name?: string };

const LeaveForm: React.FC<{ item?: LeaveItem; onSubmit: (v: LeaveItem) => Promise<{ success: boolean }>; onClose: () => void; employees?: Employee[] }> = ({ item, onSubmit, onClose, employees = [] }) => {
    const formatForInput = (d: Date) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // compute sensible defaults for half-day options
    const defaultStartForAM = () => formatForInput(new Date(new Date().setHours(9, 0, 0, 0)));
    const defaultEndForAM = () => formatForInput(new Date(new Date().setHours(12, 0, 0, 0)));
    const defaultStartForPM = () => formatForInput(new Date(new Date().setHours(13, 0, 0, 0)));
    const defaultEndForPM = () => formatForInput(new Date(new Date().setHours(17, 0, 0, 0)));

    const [values, setValues] = React.useState<LeaveItem>({
        employee_id: item?.employee_id ?? '',
        leave_type: item?.leave_type ?? 'Annual',
        start_time: item?.start_time ?? '',
        end_time: item?.end_time ?? '',
        leave_day: item?.leave_day ?? 1.0,
        duration: item?.leave_day === 0.5 ? (item.duration ?? 'HALF_AM') : 'FULL',
        reason: item?.reason ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;
        setValues(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleDurationChange = (d: 'FULL' | 'HALF_AM' | 'HALF_PM') => {
        if (d === 'FULL') {
            setValues(prev => ({ ...prev, duration: 'FULL', leave_day: 1.0 }));
        } else if (d === 'HALF_AM') {
            setValues(prev => ({ ...prev, duration: 'HALF_AM', leave_day: 0.5, start_time: prev.start_time || defaultStartForAM(), end_time: prev.end_time || defaultEndForAM() }));
        } else {
            setValues(prev => ({ ...prev, duration: 'HALF_PM', leave_day: 0.5, start_time: prev.start_time || defaultStartForPM(), end_time: prev.end_time || defaultEndForPM() }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(values);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-lg font-semibold mb-4">{item ? 'Edit' : 'Add'} Leave</h2>

                <label className="block mb-2">Employee
                    <select name="employee_id" value={values.employee_id} onChange={handleChange} className="mt-1 w-full rounded-md border px-2 py-1">
                        <option value="">Select</option>
                        {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.emp_code} - {emp.name}</option>)}
                    </select>
                </label>

                <label className="block mb-2">Type
                    <select name="leave_type" value={values.leave_type} onChange={handleChange} className="mt-1 w-full rounded-md border px-2 py-1">
                        <option>Annual</option>
                        <option>Sick</option>
                        <option>Unpaid</option>
                    </select>
                </label>

                <div className="block mb-2">
                    <div className="mb-1">Duration</div>
                    <label className="mr-4"><input type="radio" name="duration" checked={values.duration === 'FULL'} onChange={() => handleDurationChange('FULL')} /> Full day</label>
                    <label className="mr-4"><input type="radio" name="duration" checked={values.duration === 'HALF_AM'} onChange={() => handleDurationChange('HALF_AM')} /> Half day (AM)</label>
                    <label><input type="radio" name="duration" checked={values.duration === 'HALF_PM'} onChange={() => handleDurationChange('HALF_PM')} /> Half day (PM)</label>
                </div>

                <label className="block mb-2">Start
                    <Input name="start_time" type="datetime-local" value={values.start_time ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} className="mt-1" />
                </label>

                <label className="block mb-2">End
                    <Input name="end_time" type="datetime-local" value={values.end_time ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} className="mt-1" />
                </label>

                <label className="block mb-2">Days
                    <Input name="leave_day" type="number" value={String(values.leave_day ?? 1)} onChange={(e) => setValues(prev => ({ ...prev, leave_day: Number((e.target as HTMLInputElement).value) }))} className="mt-1" />
                </label>

                <label className="block mb-2">Reason
                    <textarea name="reason" value={values.reason} onChange={handleChange} className="w-full rounded-md border p-2 mt-1" />
                </label>

                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
};

export default LeaveForm;
