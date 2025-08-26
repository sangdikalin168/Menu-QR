// src/pages/InvoicePage.tsx
import React from 'react';
import type { Invoice } from '../generated/graphql';
import { InvoiceDetail } from '../components/invoice/InvoiceDetail';
import { useInvoice } from '../hooks/useInvoice';
import { toast } from 'react-toastify';

const InvoicePage: React.FC = () => {

    const {
        items,
        totalCount,
        loading,
        searchTerm,
        setSearchTerm,
        page,
        pageSize,
        setPage,
        statusFilter,
        setStatusFilter,
        editingItem,
        setEditingItem,
        openDialog,
        setOpenDialog,
        refetch,
        deleteInvoiceMutation,
        addPaymentMutation,
    } = useInvoice();

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;

        try {
            const { data } = await deleteInvoiceMutation({
                variables: { deleteInvoiceId: Number(id) },
                update: (cache) => {
                    cache.evict({ id: `Invoice:${id}` });
                },
            });

            if (!data?.deleteInvoice) {
                throw new Error('Failed to delete invoice');
            }

            alert('Invoice deleted!');
            refetch(); // ⬅ refresh list
        } catch (error) {
            alert('Failed to delete invoice');
            console.error(error);
        }
    };

    const handleAddPayment = async (invoiceId, amount, paymentMethod) => {
        console.log(`Adding payment for invoice ${invoiceId} - Amount: ${amount}, Method: ${paymentMethod}`);
        const { data, errors } = await addPaymentMutation({
            variables: {
                input: {
                    invoiceId: Number(invoiceId),
                    amount: amount,
                    paymentMethod: paymentMethod,
                }
            },
        });
        if (errors) {
            console.error('Failed to add payment:', errors);
            alert('Failed to add payment');
            return;
        }
        if (!data?.addPaymentToInvoice) {
            alert('Failed to add payment');
            return;
        }
        toast.success('Payment added successfully!', { autoClose: 1000 });
        setOpenDialog(false); // Close dialog after adding payment
        setEditingItem(null); // Clear editing item
        refetch(); // Refresh invoice
    };


    return (
        <div className='space-y-2'>
            <div className="flex gap-4 items-center">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="ស្វែងរក..."
                        className="px-3 py-2 border rounded-md text-sm"
                    />

                    <select
                        value={statusFilter ?? ''}
                        onChange={(e) =>
                            setStatusFilter(e.target.value as PaymentStatus || undefined)
                        }
                        className="px-3 py-2 border rounded-md text-sm"
                    >
                        <option value="">All</option>
                        <option value="PAID">បានទូទាត់</option>
                        <option value="PARTIAL">បានទូទាត់ខ្លះ</option>
                        <option value="UNPAID">មិនទាន់ទូទាត់</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2 text-left">Invoice No</th>
                            <th className="px-3 py-2 text-left">Customer</th>
                            <th className="px-3 py-2 text-left">Status</th>
                            <th className="px-3 py-2 text-right">សរុប</th>
                            <th className="px-3 py-2 text-right">ទូទាត់</th>
                            <th className="px-3 py-2 text-right">ជំពាក់</th>
                            <th className="px-3 py-2 text-left">Date</th>
                            <th className="px-3 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-gray-500">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            items.map((inv: Invoice & { paidAmount: number; dueAmount: number }) => (
                                <tr key={inv.id} className="border-t hover:bg-gray-50">
                                    <td className="px-3 py-2">{inv.invoiceNumber}</td>
                                    <td className="px-3 py-2">{inv.customer?.name ?? 'N/A'}</td>
                                    <td className="px-3 py-2">{inv.paymentStatus}</td>
                                    <td className="px-3 py-2 text-right">៛{inv.totalAmount}</td>
                                    <td className="px-3 py-2 text-right">៛{inv.paidAmount}</td>
                                    <td className="px-3 py-2 text-right">៛{inv.dueAmount}</td>
                                    <td className="px-3 py-2">
                                        {new Date(inv.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-3 py-2 space-x-2">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => {
                                                setEditingItem(inv);
                                                setOpenDialog(true);
                                            }}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(inv.id)}
                                            className="text-red-600 hover:underline ml-2"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm">
                <div>
                    Showing {(page - 1) * pageSize + 1} -{' '}
                    {Math.min(page * pageSize, totalCount)} of {totalCount}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={items.length < pageSize}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Dialog */}
            {openDialog && editingItem && (
                <InvoiceDetail
                    invoice={editingItem}
                    payments={editingItem.payment || []}
                    onClose={() => setOpenDialog(false)}
                    onAddPayment={handleAddPayment}
                />
            )}
        </div>
    );
};

export default InvoicePage;