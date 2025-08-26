import { useEffect, useState } from "react";
import type { Category } from "../../types/category";
import { toast } from 'react-toastify';

interface Props {
    item: Category | null;
    onSubmit: (values: Partial<Category>) => Promise<{ success: boolean }>;
    onClose: () => void;
}

export const CategoryForm = ({ item, onSubmit, onClose, }: Props) => {

    const [formValues, setFormValues] = useState<Partial<Category>>({
        name: '',
        ...item,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;

        const newValue =
            type === 'number'
                ? parseFloat(value) || 0 // Handle empty input safely
                : name === 'categoryId'
                    ? parseInt(value, 10)
                    : value;

        setFormValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formValues.name?.trim()) {
            newErrors.name = 'Name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix validation errors');
            return;
        }

        try {
            const payload = {
                name: formValues.name!
            };

            const result = await onSubmit(payload);

            // ✅ Only close modal if creation was successful
            if (result?.success) {
                toast.success('Product created successfully');
                onClose();
            } else {
                toast.error('Failed to create product');
            }
        } catch (err) {
            toast.error(`Unexpected error occurred ${err}`);
        }
    };

    useEffect(() => {
        if (item) {
            setFormValues(item);
        } else {
            setFormValues({
                name: '',
            });
        }
    }, [item]);


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            {/* Mobile-friendly modal */}
            <div className="bg-white w-full max-w-lg mx-auto rounded-lg shadow-xl overflow-hidden">
                <div className="p-4 sm:p-6">
                    <h3 className="text-xl font-bold mb-4 text-center sm:text-left">
                        {item ? 'Edit Product' : 'Add New Category'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name & Category*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Cateogry Name *</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formValues.name || ''}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 sm:pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}