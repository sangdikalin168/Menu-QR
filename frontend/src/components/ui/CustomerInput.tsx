import { useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useCreateCustomerMutation, useCustomersQuery } from '../../hooks/useCustomer'
import { toast } from 'react-toastify'

type Props = {
    value: any; // you can type this better as `Customer | null`
    onChange: (customer: any) => void;
};

export default function CustomerInput({ value, onChange }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [customName, setCustomName] = useState('');
    const [customPhone, setCustomPhone] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data: customersData, loading, refetch } = useCustomersQuery();
    const [createCustomer] = useCreateCustomerMutation();

    if (loading) return <div>Loading...</div>;
    const existingCustomers = customersData || [];

    const defaultCustomer = existingCustomers.find((cust) => cust.isDefault) || existingCustomers[0];
    const effectiveSelected = value || defaultCustomer;

    const filteredCustomers = existingCustomers.filter((cust) => {
        if (cust.isDefault) return true;
        const query = searchQuery.toLowerCase();
        return (
            cust.name?.toLowerCase().includes(query) ||
            cust.phone?.toLowerCase().includes(query)
        );
    });

    const handleAddCustomer = async () => {
        const name = customName.trim();
        const phone = customPhone.trim();

        if (!name && !phone) return;

        try {
            const res = await createCustomer({
                variables: {
                    data: {
                        name: name || 'Unknown',
                        phone: phone || '',
                    },
                },
            });

            await refetch();
            toast.success('Customer created successfully!');

            const newCustomer = res.data?.createCustomer;
            if (newCustomer) {
                onChange(newCustomer); // ✅ Update parent
            }

            setCustomName('');
            setCustomPhone('');
            setIsCreating(false);
        } catch (error) {
            toast.error('Failed to create customer. Please try again.');
            console.error('❌ Failed to create customer:', error);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <Listbox value={effectiveSelected} onChange={onChange}>
                        <div className="relative mt-1">
                            <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 outline-gray-300 focus:outline-indigo-600 sm:text-sm/6 items-center">
                                <span className="block truncate">
                                    {effectiveSelected?.name || effectiveSelected?.phone || 'Select a customer'}
                                </span>
                                <ChevronUpDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500" />
                            </ListboxButton>

                            <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                <div className="sticky top-0 z-10 bg-white px-3 py-2">
                                    <input
                                        type="text"
                                        placeholder="Search by name or phone"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded border px-2 py-1 text-sm"
                                    />
                                </div>

                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((cust) => (
                                        <ListboxOption
                                            key={cust.id}
                                            value={cust}
                                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white"
                                        >
                                            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                                                {cust.name || cust.phone || `Customer #${cust.id}`}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-focus:text-white">
                                                <CheckIcon aria-hidden="true" className="size-5" />
                                            </span>
                                        </ListboxOption>
                                    ))
                                ) : (
                                    <div className="px-3 py-2 text-sm text-gray-500">No results found</div>
                                )}
                            </ListboxOptions>
                        </div>
                    </Listbox>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="rounded-full bg-indigo-600 p-2 text-white hover:bg-indigo-700"
                    title="Create New Customer"
                >
                    <PlusIcon className="size-4" />
                </button>
            </div>

            {isCreating && (
                <div className="mt-2 space-y-2 border-t pt-2">
                    <div className="flex space-x-2">
                        <div>
                            <label className="block text-sm text-gray-600">Customer Name</label>
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                className="w-full rounded border px-2 py-1 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Phone</label>
                            <input
                                type="tel"
                                placeholder="Enter phone"
                                value={customPhone}
                                onChange={(e) => setCustomPhone(e.target.value)}
                                className="w-full rounded border px-2 py-1 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddCustomer}
                            className="flex-1 rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                        >
                            Add Customer
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setCustomName('');
                                setCustomPhone('');
                            }}
                            className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
