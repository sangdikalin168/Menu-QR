import React from 'react';


type ReceiptProps = {
    storeName?: string;
    address?: string;
    phone?: string;
    cashier: string;
    invoiceId: string;
    date: string;
    items: { name: string; quantity: number; price: number, unitLabel: string }[];
    subtotal: number;
    discount: number;
    paid: number;
    customerName?: string;
    paymentMethod?: string;
};

const SaleInvoice: React.FC<ReceiptProps> = ({
    storeName = 'វុន លីណា',
    address = 'បុរី H ផ្លូវបេតុង ផ្ទះលេខA06 ភូមិត្រពាំងរំចេក សង្កាត់ចោមចៅ១ ខណ្ឌពោធិសែនជ័យ',
    phone = '097 57 64 915',
    cashier,
    invoiceId,
    date,
    items,
    subtotal,
    discount,
    paid,
    paymentMethod,
    customerName,
}) => {
    const finalTotal = subtotal - (subtotal * discount) / 100;
    const change = paid - finalTotal;

    console.log(items);


    return (
        <div
            style={{
                fontFamily: 'Nokora, Arial, sans-serif',
                fontSize: '16px',
                color: '#000',
                width: '70mm',
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>
                {storeName}
            </div>
            <div style={{ textAlign: 'center', fontSize: '12px' }}>{address}</div>
            <div style={{ textAlign: 'center', fontSize: '12px' }}>Tel: {phone}</div>
            <div style={{ margin: '8px 0', borderTop: '1px dashed #000' }} />

            {/* Meta */}
            <div style={{ marginBottom: '8px', fontSize: '12px' }}>
                <div>ការបរិច្ឆេទ: {new Date(date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\b(am|pm)\b/g, match => match.toUpperCase())}</div>
                <div>Invoice: {invoiceId}</div>
                <div>បេឡាករ: {cashier}</div>
                {customerName && <div>អតិថិជន: {customerName}</div>}
                {paymentMethod && (
                    <div>
                        ទូទាត់តាមរយៈ:{' '}
                        {paymentMethod === 'CASH'
                            ? 'សាច់ប្រាក់'
                            : paymentMethod === 'BANK_TRANSFER'
                                ? 'ABA'
                                : paymentMethod}
                    </div>
                )}

            </div>

            <div style={{ margin: '8px 0', borderTop: '1px dashed #000' }} />

            {/* Items */}
            <table className="w-full text-xs border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="text-left border border-black p-1">ឈ្មោះទំនិញ</th>
                        <th className="text-left border border-black p-1">ចំនួន</th>
                        <th className="text-right border border-black p-1">តម្លៃ</th>
                        <th className="text-right border border-black p-1">សរុប</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <React.Fragment key={item.name + index}>
                            {/* Product Name Row */}
                            <tr className="hover:bg-gray-50 transition-all duration-300 ease-in-out">
                                <td className="py-1 text-left font-medium border border-black p-1">{item.name}</td>
                                <td className="py-1 text-left border border-black p-1">{item.quantity} ({item.unitLabel})</td>
                                <td className="py-1 text-right border border-black p-1">៛{item.price.toLocaleString()}</td>
                                <td className="py-1 text-right border border-black p-1">៛{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div style={{ margin: '8px 0', borderTop: '1px dashed #000' }} />

            {/* Totals */}
            <div>
                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>៛{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Discount</span>
                    <span>{discount}% ({(discount / 100) * subtotal}៛)</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginTop: '4px',
                    }}
                >
                    <span>សរុបរួម (KHR)</span>
                    <span>៛{finalTotal}</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        marginTop: '4px',
                    }}
                >
                    <span>សរុបរួម (USD)</span>
                    <span>${(finalTotal / 4000).toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span>ប្រាក់ទទួលបាន</span>
                    <span>៛{paid.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>លុយអាប់</span>
                    <span>៛{change.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ margin: '8px 0', borderTop: '1px dashed #000' }} />

            <div className="text-center" style={{ fontSize: '12px', marginTop: '8px' }}>
                សូមអរគុណសម្រាប់ការទិញទំនិញពីយើងខ្ញុំ!
            </div>

            {/* Footer And Payment QRCode*/}
            <div style={{ textAlign: 'center', fontSize: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/ABA-QR-CODE.jpg`} // Replace with actual QR code URL
                        alt="Payment QR Code"
                        style={{ width: '150px', height: '200px' }}
                    />
                </div>
                <div>Scan to pay</div>
            </div>

        </div>
    );
};

export default SaleInvoice;
