import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useCategoriesQuery } from '../../generated/graphql'; // Adjust the import path as necessary

type Props = {
    value: number | null;
    onChange: (categoryId: number | null) => void;
};

export const CategorySelect = ({ value, onChange }: Props) => {
    const { data, loading } = useCategoriesQuery();
    const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);

    const categories = data?.categories ?? [];

    useEffect(() => {
        if (value != null) {
            const found = categories.find((c) => c.id === value);
            if (found) setSelectedCategory(found);
        }
    }, [value, categories]);

    const handleSelect = (category: { id: number; name: string } | null) => {
        setSelectedCategory(category);
        onChange(category?.id ?? null);
    };

    return (
        <div className="w-60">
            <Listbox value={selectedCategory} onChange={handleSelect}>
                <div className="relative">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <span className="block truncate">
                            {selectedCategory ? selectedCategory.name : 'Select category'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border text-sm shadow-lg z-10">
                            <Listbox.Option
                                key="none"
                                value={null}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                    }`
                                }
                            >
                                Clear selection
                            </Listbox.Option>
                            {categories.map((category) => (
                                <Listbox.Option
                                    key={category.id}
                                    value={category}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                {category.name}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};
