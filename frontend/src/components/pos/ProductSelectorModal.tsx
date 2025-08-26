import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import type { UnitType, PriceTier } from '../../generated/graphql';


const ProductSelectorModal: React.FC = ({ product, onAdd, onClose }) => {
    const [unitType, setUnitType] = useState('unit');
    const [priceTier, setPriceTier] = useState<PriceTier>('RETAIL');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(product.retailPrice);

    const [selectionKey, setSelectionKey] = useState('unit_RETAIL');

    useEffect(() => {
        const [unitTypeValue, priceTierValue] = selectionKey.split('_') as [UnitType, PriceTier];
        setUnitType(unitTypeValue);
        setPriceTier(priceTierValue);

        const isBox = unitTypeValue === 'box';
        const selectedPrice = isBox
            ? priceTierValue === 'RETAIL'
                ? product.boxRetailPrice ?? 0
                : product.boxWholesalePrice ?? 0
            : priceTierValue === 'RETAIL'
                ? product.retailPrice ?? 0
                : product.wholesalePrice ?? 0;

        setPrice(selectedPrice);
    }, [selectionKey, product]);


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={
                            typeof product.imageUrl === 'string'
                                ? `${import.meta.env.VITE_API_URL}${product.imageUrl}`
                                : product.imageUrl instanceof File
                                    ? URL.createObjectURL(product.imageUrl)
                                    : `${import.meta.env.VITE_API_URL}/uploads/default-product.jpg`
                        }
                        alt={product.name}
                        className="w-full h-78 object-cover rounded-md"
                    />
                </div>


                <div>

                    <label className="block text-sm font-medium mb-1">ជ្រើសរើសតម្លៃ</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="priceOption"
                                value="unit_RETAIL"
                                checked={selectionKey === 'unit_RETAIL'}
                                onChange={() => setSelectionKey('unit_RETAIL')}
                            />
                            <span>1{product.unitName} (រាយ) (1{product.unitName} - {product.retailPrice.toLocaleString()} KHR)</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="priceOption"
                                value="unit_WHOLESALE"
                                checked={selectionKey === 'unit_WHOLESALE'}
                                onChange={() => setSelectionKey('unit_WHOLESALE')}
                            />
                            <span>1{product.unitName} (បោះដុំ) (1{product.unitName} - {product.wholesalePrice?.toLocaleString() ?? 0} KHR)</span>
                        </label>

                        {product.hasBoxes && (
                            <>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="priceOption"
                                        value="box_RETAIL"
                                        checked={selectionKey === 'box_RETAIL'}
                                        onChange={() => setSelectionKey('box_RETAIL')}
                                    />
                                    <span>1{product.boxUnitName}  (រាយ) (1{product.boxUnitName} = {product.pcsPerBox}{product.unitName} - {product.boxRetailPrice?.toLocaleString() ?? 0} KHR)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="priceOption"
                                        value="box_WHOLESALE"
                                        checked={selectionKey === 'box_WHOLESALE'}
                                        onChange={() => setSelectionKey('box_WHOLESALE')}
                                    />
                                    <span>1{product.boxUnitName}  (បោះដុំ) (1{product.boxUnitName} = {product.pcsPerBox}{product.unitName} - {product.boxWholesalePrice?.toLocaleString() ?? 0} KHR)</span>
                                </label>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">ចំនួន</label>
                    <div className='flex items-center gap-2'>
                        <input
                            type="number"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <span className="text-sm text-gray-500">
                            {/* Display unit type based on selection retail and wholesale selection*/}
                            {unitType === 'unit' ? product.unitName : product.boxUnitName}
                        </span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">តម្លៃសរុប (KHR)</label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 rounded px-2 py-1"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        បោះបង់
                    </button>
                    <button
                        onClick={() => {
                            onAdd({
                                id: product.id,
                                name: product.name,
                                quantity,
                                price,
                                unitType,
                                pcsPerBox: product.pcsPerBox,
                                priceTier,
                                unitName: product.unitName,
                                boxUnitName: product.boxUnitName
                            });
                            toast.success('Product added to cart', { autoClose: 300 });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        រួចរាល់
                    </button>
                </div>
            </div>
        </div >
    );
};

export default ProductSelectorModal;

