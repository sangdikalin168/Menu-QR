// src/pages/Home.tsx
"use client"
import React, { useState } from 'react';
import { useProductsQuery } from '../generated/graphql';

const Dashboard: React.FC = () => {
    const { data, loading, error } = useProductsQuery();
    // Get all categories from products
    const allCategories = Array.from(new Set((data?.products ?? []).flatMap(p => p.categories.map(c => c.name))));
    const categories = ["All", ...allCategories];
    const [displayType, setDisplayType] = useState<'grid' | 'row'>('grid');
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
    // Filter products by selected category
    const filteredProducts = selectedCategory === 'All'
        ? (data?.products ?? [])
        : (data?.products ?? []).filter(product => product.categories.some(c => c.name === selectedCategory));

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="flex flex-1 flex-col">
            <div className="sticky top-0 z-10 bg-white py-2 shadow-sm mb-2">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-2 mb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold transition ${selectedCategory === cat ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex items-center justify-between px-2 mb-2">
                    <h1 className="text-2xl font-bold">{selectedCategory}</h1>
                    <button
                        onClick={() => setDisplayType(displayType === 'grid' ? 'row' : 'grid')}
                        className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center ml-2"
                        title={displayType === 'grid' ? 'Switch to Row View' : 'Switch to Grid View'}
                    >
                        {displayType === 'grid' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="6" width="18" height="3"/><rect x="3" y="15" width="18" height="3"/></svg>
                        )}
                    </button>
                </div>
            </div>
            {/* Category name and switch view button are now inline above */}
            {displayType === 'grid' ? (
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow">
                            <img src={product.image ?? ''} alt={product.name} className="w-20 h-20 object-cover mb-2 rounded" />
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-gray-500">${product.price}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 flex flex-col items-center bg-white shadow">
                            <img src={product.image ?? ''} alt={product.name} className="w-20 h-20 object-cover mb-2 rounded" />
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-gray-500">${product.price}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;