import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type DepartmentItem = { id?: string; name?: string; description?: string };

export const DepartmentForm: React.FC<{ item?: DepartmentItem; onSubmit: (v: { name: string; description?: string }) => Promise<{ success: boolean }>; onClose: () => void }> = ({ item, onSubmit, onClose }) => {
    const [values, setValues] = React.useState<{ name: string; description?: string }>({ name: item?.name ?? '', description: item?.description ?? '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onSubmit(values); };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
                <h2 className="text-lg font-semibold mb-4">{item ? 'Edit' : 'Add'} Department</h2>
                <label className="block mb-2">Name
                    <Input name="name" value={values.name} onChange={handleChange} className="mt-1" />
                </label>
                <label className="block mb-2">Description
                    <textarea name="description" value={values.description} onChange={handleChange} className="border-input rounded-md p-2 w-full mt-1" />
                </label>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild={false} onClick={onClose} className="px-3 py-1">Cancel</Button>
                    <Button type="submit" className="px-3 py-1">Save</Button>
                </div>
            </form>
        </div>
    );
};

export default DepartmentForm;
