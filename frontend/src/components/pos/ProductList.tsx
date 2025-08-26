// src/components/pos/ProductList.tsx
import React, { useState } from 'react';
import { usePOS } from '../../hooks/POSContext';
import { TextInput } from '../ui/TextInput';
import { PrimaryButton } from '../ui/PrimaryButton';
import ProductSelectorModal from './ProductSelectorModal';
import LoadingPage from '../ui/LoadingPage';


export const ProductList: React.FC = () => {
    const { addToCart, products, loading, error } = usePOS();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<null>(null);

    const categories = [
        'All',
        ...new Set(
            products
                .map((p) =>
                    typeof p.category === 'string'
                        ? p.category
                        : p.category?.name
                )
                .filter((name): name is string => Boolean(name)) // ✅ Ensures `name` is a string
        ),
    ];


    const filteredProducts = products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch =
            selectedCategory === 'All' || (typeof p.category === 'string'
                ? p.category === selectedCategory
                : p.category?.name === selectedCategory);
        return nameMatch && categoryMatch;
    });

    const handleAddProduct = (product) => {
        setSelectedProduct(product)
    };

    if (loading) return <LoadingPage />;
    if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-2 sm:space-y-0">
                {/* Search Input */}
                <div>
                    <TextInput
                        id="product-search"
                        name="product-search"
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search products"
                    />
                </div>

                {/* Category Buttons */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <PrimaryButton
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                } hover:bg-blue-600 transition-colors text-nowrap`}
                            aria-label={`Filter by ${cat}`}
                            fullWidth={false}
                        >
                            {cat}
                        </PrimaryButton>
                    ))}
                </div>
            </div>

            <div className='flex-1 overflow-y-auto'>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleAddProduct(product)}
                            className="cursor-pointer bg-white shadow-md rounded-lg p-2 hover:bg-gray-100 transition-all"
                        >
                            <img
                                src={
                                    typeof product.imageUrl === 'string'
                                        ? `${import.meta.env.VITE_API_URL}${product.imageUrl}`
                                        : product.imageUrl instanceof File
                                            ? URL.createObjectURL(product.imageUrl)
                                            : `${import.meta.env.VITE_API_URL}/uploads/default-product.jpg`
                                }
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-md"
                            />


                            <h1 className="mt-2 text-xs font-semibold truncate">{product.name}</h1>
                            <div className="flex justify-between">
                                <p className="text-xs text-gray-600">៛{product.boxWholesalePrice.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">
                                    {product.pcsPerBox > product.stock.quantity
                                        ? `${product.stock.quantity} ${product.unitName}`
                                        : `${Math.floor(product.stock.quantity / product.pcsPerBox)} ${product.boxUnitName}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Selector Modal */}
            {selectedProduct && (
                <ProductSelectorModal
                    product={selectedProduct}
                    onAdd={({ quantity, unitType, price, priceTier }) => {
                        addToCart({
                            id: selectedProduct.id,
                            name: selectedProduct.name,
                            quantity,
                            price,
                            unitType,
                            pcsPerBox: selectedProduct.pcsPerBox,
                            priceTier,
                            unitName: unitType === 'unit' ? selectedProduct.unitName : selectedProduct.boxUnitName,
                        });
                        setSelectedProduct(null);
                    }}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};
