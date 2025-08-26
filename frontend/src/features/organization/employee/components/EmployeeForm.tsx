import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Employee = {
    id?: string;
    emp_code?: string;
    name?: string;
    phone?: string;
    national_id?: string;
    hire_date?: string;
    position_id?: string;
    department_id?: string;
    is_resigned?: boolean;
};

type Dept = { id: string; name: string };
type Pos = { id: string; name: string };

export const EmployeeForm: React.FC<{ item?: Employee; onSubmit: (v: Employee) => Promise<{ success: boolean }>; onClose: () => void; departments?: Dept[]; positions?: Pos[] }> = ({ item, onSubmit, onClose, departments = [], positions = [] }) => {
    const [values, setValues] = React.useState<Employee>({
        emp_code: item?.emp_code ?? '',
        name: item?.name ?? '',
        phone: item?.phone ?? '',
        national_id: item?.national_id ?? '',
        hire_date: item?.hire_date ?? '',
        position_id: item?.position_id ?? undefined,
        department_id: item?.department_id ?? undefined,
        is_resigned: item?.is_resigned ?? false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;
        setValues(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(values);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-lg font-semibold mb-4">{item ? 'Edit' : 'Add'} Employee</h2>
                <label className="block mb-2">Employee Code
                    <Input name="emp_code" value={values.emp_code} onChange={handleChange as any} className="mt-1" />
                </label>
                <label className="block mb-2">Name
                    <Input name="name" value={values.name} onChange={handleChange as any} className="mt-1" />
                </label>
                <label className="block mb-2">Phone
                    <Input name="phone" value={values.phone} onChange={handleChange as any} className="mt-1" />
                </label>
                <label className="block mb-2">National ID
                    <Input name="national_id" value={values.national_id} onChange={handleChange as any} className="mt-1" />
                </label>
                <label className="block mb-2">Hire Date
                    <Input type="date" name="hire_date" value={values.hire_date?.split('T')[0] ?? ''} onChange={handleChange as any} className="mt-1" />
                </label>
                <label className="block mb-2">Department
                    <select name="department_id" value={values.department_id ?? ''} onChange={handleChange} className="border-input rounded-md p-2 w-full mt-1">
                        <option value="">Select</option>
                        {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </label>
                <label className="block mb-2">Position
                    <select name="position_id" value={values.position_id ?? ''} onChange={handleChange} className="border-input rounded-md p-2 w-full mt-1">
                        <option value="">Select</option>
                        {positions.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </label>
                <label className="block mb-2">
                    <input type="checkbox" name="is_resigned" checked={values.is_resigned} onChange={handleChange} /> Resigned
                </label>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
