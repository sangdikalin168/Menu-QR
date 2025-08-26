// src/components/pos/Cart.tsx
import React, { useState } from 'react';
import { usePOS, usePOSActions } from '../../hooks/POSContext';
import { XMarkIcon } from '@heroicons/react/20/solid'
import { BarcodeScannerInput } from '../ui/BarcodeScannerInput';
import { toast } from 'react-toastify';
import CustomerInput from '../ui/CustomerInput';
import SaleInvoice from './SaleInvoice';
import ReactDOMServer from 'react-dom/server';
import LoadingPage from '../ui/LoadingPage';

export const Cart: React.FC = () => {

    const { createInvoice } = usePOSActions();
    const lastScannedRef = React.useRef<string | null>(null);

    const [selectedCustomer, setSelectedCustomer] = React.useState<{ id: number; name: string } | null>(null);
    const handleBarcodeScan = (barcode: string) => {
        if (lastScannedRef.current === barcode) return;
        lastScannedRef.current = barcode;
        setTimeout(() => {
            lastScannedRef.current = null;
        }, 500); // Allow scan again after 500ms

        const product = findProductByBarcode(barcode);
        if (product) {
            const unitType = product.unitBarCode === barcode ? 'unit' : 'box';
            addToCart({
                ...product,
                unitType,
                quantity: 1,
            });
        } else {
            toast.error(`Product not found`, { autoClose: 500 });
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const [isPayNowShow, setIsPayNowShow] = React.useState(false);
    const [isInvoiceShow, setIsInvoiceShow] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = React.useState('CASH');
    const [amountPaid, setAmountPaid] = React.useState(0);
    const [invoiceData, setInvoiceData] = useState<{
        items: {
            name: string;
            quantity: number;
            price: number;
            unitType: string,
            unitLabel?: string; // Optional for unit/box distinction
        }[];
        invoiceId: string;
        date: string;
        customerName: string;
        paymentMethod: string;
        paid: number;
    } | null>(null);

    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        subtotal,
        discount,
        setDiscount,
        discountType,
        setDiscountType,
        finalTotal,
        findProductByBarcode,
        addToCart,
        clearCart,
        refetchProducts
    } = usePOS();

    return (
        <>
            {/* Loading Page */}
            {isLoading && <LoadingPage />}
            <div className="bg-white shadow-md rounded-lg p-4 sticky top-6 h-[89vh] flex flex-col">
                {/* --- Barcode & Customer Section --- */}
                <div>
                    <div className="mb-4">
                        {/* Barcode Scanner */}
                        <div className="w-full" >
                            <BarcodeScannerInput
                                onScan={handleBarcodeScan}
                                placeholder="Scan Barcode"
                            />
                        </div >

                        {/* Customer Selector */}
                        < div className="w-full mt-2" >
                            <CustomerInput value={selectedCustomer} onChange={setSelectedCustomer} />
                        </div >
                    </div >
                </div >

                {/* --- Cart Items (Scrollable) --- */}
                < div className="flex-1 overflow-y-auto" >
                    {
                        cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No items in cart</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="text-left">ឈ្មោះ</th>
                                        <th className="text-center">ចំនួន</th>
                                        <th className="text-center">ឯកតា</th>
                                        <th className="text-right">តម្លៃ</th>
                                        <th className="text-right">សរុប</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <tr className="align-top hover:bg-gray-50 transition-all duration-300 ease-in-out">
                                                <td className="py-2 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => removeFromCart(item.id, item.unitType)}
                                                            className="text-red-500 hover:text-red-700"
                                                            aria-label="Remove item"
                                                        >
                                                            <XMarkIcon className="h-4 w-4" />
                                                        </button>
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2 text-center">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const qty = parseInt(e.target.value);
                                                            if (!isNaN(qty) && qty > 0) {
                                                                updateQuantity(item.id, item.unitType, qty);
                                                            }
                                                        }}
                                                        className="w-14 text-center border border-gray-300 rounded px-2 py-0.5 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                        aria-label={`Quantity for ${item.name}`}
                                                    />
                                                </td>
                                                <td className="py-2 text-center">
                                                    {item.unitName}
                                                </td>
                                                <td className="py-2 text-right">
                                                    ៛{(item.price.toLocaleString())}
                                                </td>
                                                <td className="py-2 text-right">
                                                    ៛{(item.price * item.quantity).toLocaleString()}
                                                </td>
                                            </tr>
                                            {index !== cartItems.length - 1 && (
                                                <tr>
                                                    <td colSpan={3}>
                                                        <div className="border-b border-gray-200"></div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )
                    }
                </div >

                {/* --- Order Summary + Action Buttons --- */}
                < div >
                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal:</span>
                            <span>៛{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2 items-center gap-2">
                            <span>Discount:</span>

                            {/* Input + Select in one line */}
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    min="0"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                    className="w-40 text-center border border-gray-300 rounded px-2 py-0.5"
                                />
                                <select
                                    value={discountType}
                                    onChange={(e) => {
                                        const newType = e.target.value as 'percent' | 'amount';
                                        setDiscount((prev: number) => {
                                            if (newType === 'percent') {
                                                return subtotal > 0 ? Math.round((prev / subtotal) * 100) : 0;
                                            } else {
                                                return Math.round((prev / 100) * subtotal);
                                            }
                                        });
                                        setDiscountType(newType);
                                    }}
                                    className="border border-gray-300 rounded px-2 py-0.5 text-sm"
                                >
                                    <option value="percent">%</option>
                                    <option value="amount">៛</option>
                                </select>
                            </div>
                        </div>


                        <div className="flex justify-between font-bold">
                            <span>Total KHR:</span>
                            <span>៛{finalTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total USD:</span>
                            <span>${(finalTotal / 4000).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {cartItems.length > 0 && (
                        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
                            <button
                                onClick={() => clearCart()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-yellow-700"
                            >
                                លុបចោល
                            </button>
                            <button
                                onClick={() => { setIsPayNowShow(true); setAmountPaid(finalTotal); setPaymentMethod('CASH'); }}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                ទូទាត់
                            </button>
                        </div>
                    )}

                    {isPayNowShow && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                            <div className="bg-white w-full max-w-lg mx-auto rounded-lg shadow-xl overflow-hidden">
                                <div className="p-4 sm:p-6">
                                    <h3 className="text-xl font-bold mb-4 text-center sm:text-left">Complete Payment</h3>

                                    <form
                                        className="space-y-4"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            setIsLoading(true); // Show loading page

                                            try {
                                                const result = await createInvoice({
                                                    cartItems,
                                                    discount,
                                                    cashierId: 1,
                                                    customerId: selectedCustomer?.id ?? 1, // Default to 1 if no customer selected
                                                    paymentAmount: amountPaid,
                                                    paymentMethod: paymentMethod.toUpperCase(),
                                                });

                                                setInvoiceData({
                                                    items: cartItems.map((item) => ({
                                                        name: item.name,
                                                        quantity: item.quantity,
                                                        price: item.price,
                                                        unitType: item.unitType,
                                                        priceTier: item.priceTier, // Use unitName for display
                                                        unitLabel: item.unitName, // Optional for unit/box distinction
                                                    })),
                                                    invoiceId: result?.invoiceNumber || 'N/A',
                                                    date: new Date().toLocaleString(),
                                                    customerName: result?.customer?.name || 'អតិថិជនទូទៅ',
                                                    paymentMethod,
                                                    paid: amountPaid,
                                                });

                                                setIsPayNowShow(false);
                                                setIsInvoiceShow(true);
                                                toast.success("Payment successful", { autoClose: 1000 });

                                                refetchProducts(); // Refresh product list

                                                setIsLoading(false); // Hide loading page
                                            } catch (err) {
                                                console.error("Failed to create invoice", err);
                                                toast.error("Failed to complete payment");
                                            }
                                        }}
                                    >
                                        {/* Displayed Fields */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Subtotal:</span>
                                                <span>៛{subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span>Discount:</span>
                                                <span>
                                                    {discountType === 'percent'
                                                        ? `${discount}% (${((discount / 100) * subtotal).toFixed(2)}៛)`
                                                        : `៛${discount} (${((discount / subtotal) * 100).toFixed(2)}%)`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-base font-semibold">
                                                <span>Total KHR:</span>
                                                <span>៛{finalTotal}</span>
                                            </div>
                                            <div className="flex justify-between text-base font-semibold">
                                                <span>Total USD:</span>
                                                <span>${(finalTotal / 4000).toFixed(2)}</span>
                                            </div>

                                            <div className="flex justify-between text-base font-semibold">
                                                <span>នៅខ្វះ:</span>
                                                <span>៛{finalTotal - amountPaid}</span>
                                            </div>
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">ទូទាត់តាមរយៈ</label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:outline-indigo-600 sm:text-sm"
                                                required
                                            >
                                                <option value="CASH">សាច់ប្រាក់</option>
                                                <option value="BANK_TRANSFER">ABA</option>
                                            </select>
                                        </div>

                                        {/* Received Amount*/}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">ប្រាក់ទទួលបាន</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={amountPaid}
                                                onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
                                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 focus:outline-indigo-600 sm:text-sm"
                                                required
                                            />
                                        </div>

                                        {/* Change */}
                                        <span className={`text-sm ${amountPaid < finalTotal ? 'text-red-600' : 'text-green-600'}`}>
                                            លុយអាប់: ៛{!isNaN(amountPaid) ? Math.max(0, amountPaid - finalTotal).toFixed(2) : '0.00'}
                                        </span>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 sm:pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsPayNowShow(false)}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                                            >
                                                បោះបង់
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                                            >
                                                ទូទាត់
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {isInvoiceShow && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                            <div className="bg-white shadow-lg p-4 w-[90mm] max-h-full overflow-auto">
                                <SaleInvoice
                                    cashier="Cashier"
                                    invoiceId={invoiceData?.invoiceId || ''}
                                    date={invoiceData?.date || ''}
                                    items={invoiceData?.items || []}
                                    subtotal={subtotal}
                                    discount={discount}
                                    paid={invoiceData?.paid || 0}
                                    customerName={invoiceData?.customerName || ''}
                                    paymentMethod={invoiceData?.paymentMethod || ''}
                                />
                                <div className="mt-4 flex justify-between">
                                    <button
                                        onClick={() => {
                                            //Render SaleInvoice to an HTML string (using ReactDOMServer)
                                            const invoiceContent = ReactDOMServer.renderToStaticMarkup(
                                                <SaleInvoice
                                                    cashier="Cashier"
                                                    invoiceId={invoiceData?.invoiceId || ''}
                                                    date={invoiceData?.date || ''}
                                                    items={invoiceData?.items || []}
                                                    subtotal={subtotal}
                                                    discount={discount}
                                                    paid={invoiceData?.paid || 0}
                                                    customerName={invoiceData?.customerName || ''}
                                                    paymentMethod={invoiceData?.paymentMethod || ''}
                                                />
                                            )

                                            const fullHtml = `
                                            <!DOCTYPE html>
                                            <html>
                                            <head>
                                                <meta charset="utf-8" />
                                                <title>Receipt</title>
                                                <style>
                                                @page {
                                                    margin: 0;
                                                }
                                                body {
                                                    margin: 0;
                                                    padding: 0;
                                                }
                                                </style>
                                            </head>
                                            <body>
                                                ${invoiceContent}
                                            </body>
                                            </html>
                                        `;


                                            if (window.electronAPI?.printReceipt) {
                                                window.electronAPI.printReceipt(fullHtml, 2);
                                            } else {
                                                console.error('printReceipt is not available');
                                            }


                                            // Wait for silent print to start before clearing
                                            setTimeout(() => {
                                                clearCart(); // Clear cart after successful payment
                                                setIsInvoiceShow(false);
                                                setInvoiceData(null); // Reset invoice data
                                            }, 500); // or adjust based on print speed
                                        }}
                                        className="px-4 py-1 text-sm bg-green-600 text-white rounded"
                                    >
                                        ព្រីនវិក្កយបត្រ
                                    </button>
                                    <button
                                        className="px-4 py-1 text-sm bg-green-600 text-white rounded"
                                        onClick={() => {
                                            // Wait for silent print to start before clearing
                                            clearCart(); // Clear cart after successful payment
                                            setIsInvoiceShow(false);
                                            setInvoiceData(null); // Reset invoice data
                                        }}
                                    >
                                        បោះបង់
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div >
            </div >
        </>
    );
};