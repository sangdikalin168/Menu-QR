"use client"
import * as React from 'react';
import { useState, useCallback } from 'react';
import { useCategoriesQuery, useAllProductsQuery } from '../generated/graphql';
import { Skeleton } from '../components/ui/skeleton';

const SkeletonCard: React.FC = () => (
    <div className="border rounded-lg p-4 flex flex-col items-center bg-white shadow">
        <Skeleton className="w-32 h-32 mb-2" />
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-4 w-16" />
    </div>
);

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const Dashboard: React.FC = () => {
    const { data: categoryData, loading: _categoryLoading, error: _categoryError } = useCategoriesQuery();
    // Use allProducts to get ALL products for the dashboard (not paginated)
    const { data, loading, error } = useAllProductsQuery();
    const [displayType, setDisplayType] = useState<'grid' | 'row'>('grid');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedTopLevel, setSelectedTopLevel] = useState<string | null>(null);

    // Use all categories from the Category table
    const allCategories = React.useMemo(() => categoryData?.categories ?? [], [categoryData?.categories]);
    const topLevelCategories = React.useMemo(() => allCategories.filter(cat => !cat.parentId), [allCategories]);

    // When a top-level category is clicked, update selectedTopLevel
    const handleTopLevelClick = useCallback((catName: string) => {
        setSelectedCategory(catName);
        setSelectedTopLevel(catName);
    }, []);

    // When a sub-category is clicked, keep selectedTopLevel
    const handleSubCategoryClick = useCallback((subName: string) => {
        setSelectedCategory(subName);
    }, []);

    // Sub-categories for the currently selected top-level
    const subCategories = React.useMemo(() => {
        return selectedTopLevel
            ? topLevelCategories.find(cat => cat.name === selectedTopLevel)?.children ?? []
            : [];
    }, [selectedTopLevel, topLevelCategories]);

    const filteredProducts = React.useMemo(() => {
        const products = data?.allProducts ?? [];
        
        if (selectedCategory === 'All') return products;
        
        return products.filter(product => {
            // If selectedCategory is a top-level category, show products related to that category or its sub-categories
            const topCat = topLevelCategories.find(cat => cat.name === selectedCategory);
            if (topCat) {
                // Get all sub-category names
                const subCatNames = (topCat.children ?? []).map(sub => sub.name);
                return product.categories?.some(cat => cat.name === selectedCategory || subCatNames.includes(cat.name));
            }
            // Otherwise, filter by sub-category
            return product.categories?.some(cat => cat.name === selectedCategory);
        });
    }, [data?.allProducts, selectedCategory, topLevelCategories]);

    // Handler for "All" button
    const handleAllClick = useCallback(() => {
        setSelectedCategory("All");
        setSelectedTopLevel(null);
    }, []);

    // Handler for display type toggle
    const handleDisplayTypeToggle = useCallback(() => {
        setDisplayType(prev => prev === 'grid' ? 'row' : 'grid');
    }, []);

    const [currentPromo, setCurrentPromo] = useState(0);
    const promotionImages = React.useMemo(() => ['/public/promo1.jpg', '/public/promo2.jpg', '/public/promo3.jpg'], []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromo(prev => (prev + 1) % promotionImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [promotionImages.length]);

    if (error) return <div>Error loading products</div>;


    return (
        <div className="flex flex-1 flex-col">
            {/* Promotion Slide */}
            {/* <div className="w-full flex justify-center items-center mb-4">
                <div className="relative w-full max-w-xl h-40 overflow-hidden rounded-lg shadow">
                    {promotionImages.map((img, idx) => (
                        <img
                            key={img}
                            src={img}
                            alt={`Promotion ${idx + 1}`}
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${currentPromo === idx ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                </div>
            </div> */}

            {/* Top Level Category Buttons below promotion */}
            <div className="w-full flex gap-2 px-2 mb-4 mt-4">
                {topLevelCategories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleTopLevelClick(cat.name)}
                        className={`w-full px-2 py-2 rounded-lg font-semibold text-lg transition ${selectedCategory === cat.name ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
            {/* Sub-categories always shown when a top-level is selected */}
            {selectedTopLevel && subCategories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-2 mb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {subCategories.map(sub => (
                        <button
                            key={sub.id}
                            onClick={() => handleSubCategoryClick(sub.name)}
                            className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold transition ${selectedCategory === sub.name ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex items-center justify-between px-2 mb-2">
                <h1 className="text-2xl font-bold">{selectedCategory}</h1>
                <button
                    onClick={handleDisplayTypeToggle}
                    className="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center ml-2"
                    title={displayType === 'grid' ? 'Switch to Row View' : 'Switch to Grid View'}
                >
                    {displayType === 'grid' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="6" width="18" height="3" /><rect x="3" y="15" width="18" height="3" /></svg>
                    )}
                </button>
            </div>
            {/* Product grid/row section */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
                    {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : displayType === 'grid' ? (
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="border rounded-lg flex flex-col items-center bg-white shadow relative">
                            <div className="absolute top-2 left-2 bg-white bg-opacity-80 rounded px-2 py-1 text-xs font-bold text-blue-700 shadow z-10">${product.price}</div>
                            <img src={product.image ? `${API_URL}${product.image}` : '/public/default-product.png'} alt={product.name} loading="lazy" className="w-32 h-32 object-cover mb-2 rounded" />
                            <div className="font-semibold text-sm p-2">{product.name}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="border rounded-lg flex flex-row items-center bg-white shadow p-2">
                            <img src={product.image ? `${API_URL}${product.image}` : '/public/default-product.png'} alt={product.name} className="w-24 h-24 object-cover rounded mr-4" />
                            <div className="flex flex-1 flex-col justify-center">
                                <div className="font-semibold">{product.name}</div>
                                <div className="text-gray-500">${product.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;