import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import { DateRangePicker } from '../components/ui/date-range-picker';

const INCOME_REPORT_QUERY = gql`
  query IncomeReport($startDate: DateTime, $endDate: DateTime) {
    incomeReport(startDate: $startDate, endDate: $endDate) {
      payments {
        id
        amount
        paymentMethod
        paymentDate
        invoice {
          id
          invoiceNumber
          invoiceItem {
            id
            quantity
            unitPrice
            product {
              id
              name
            }
          }
        }
      }
      invoices {
        id
        invoiceNumber
        totalAmount
        paidAmount
        paymentStatus
        createdAt
        invoiceItem {
          id
          quantity
          unitPrice
          product {
            id
            name
          }
        }
      }
    }
  }
`;

export const IncomeReport = () => {
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);


    const setQuickRange = (type: 'today' | '7d' | '1m') => {
        const now = new Date();
        const end = new Date(now);
        end.setHours(23, 59, 59, 999); // ✅ include full day

        const start = new Date(now);

        switch (type) {
            case '7d':
                start.setDate(start.getDate() - 6); // last 7 days including today
                start.setHours(0, 0, 0, 0);
                break;
            case '1m':
                start.setMonth(start.getMonth() - 1);
                start.setHours(0, 0, 0, 0);
                break;
            case 'today':
            default:
                start.setHours(0, 0, 0, 0);
                break;
        }

        setDateRange({ start, end });
    };


    const { data, loading, error } = useQuery(INCOME_REPORT_QUERY, {
        variables: {
            startDate: dateRange?.start.toISOString(),
            endDate: dateRange?.end.toISOString(),
        },
        skip: !dateRange,
    });

    console.log("rendering IncomeReport...");

    const summary = useMemo(() => {
        console.log("🔁 summary useMemo called");

        let totalIncome = 0;
        let invoiceTotal = 0;
        let unpaidTotal = 0;
        let methodTotals: Record<string, number> = {};
        const daily: Record<string, Record<string, number>> = {};

        data?.incomeReport.payments.forEach((payment: any) => {
            const date = format(new Date(payment.paymentDate), 'yyyy-MM-dd');
            const method = payment.paymentMethod;

            totalIncome += payment.amount;
            methodTotals[method] = (methodTotals[method] || 0) + payment.amount;

            if (!daily[date]) daily[date] = {};
            daily[date][method] = (daily[date][method] || 0) + payment.amount;
        });

        const seenInvoices = new Set();

        data?.incomeReport.invoices.forEach((invoice: any) => {
            if (seenInvoices.has(invoice.id)) return; // 🛑 Skip duplicates
            seenInvoices.add(invoice.id);

            invoiceTotal += invoice.totalAmount || 0;
            unpaidTotal += (invoice.totalAmount || 0) - (invoice.paidAmount || 0);

            console.log(`Processing invoice ${invoice.invoiceNumber}: total=${invoice.totalAmount}, paid=${invoice.paidAmount}, balance=${(invoice.totalAmount || 0) - (invoice.paidAmount || 0)}`);

        });

        console.log("Function called");

        return { daily, totalIncome, invoiceTotal, unpaidTotal, methodTotals };
    }, [data]);

    const allItems = useMemo(() => {

        console.log("🔁 allItems useMemo called");
        const items: Record<string, { name: string; quantity: number }> = {};
        data?.incomeReport.payments.forEach((entry: any) => {
            entry.invoice.invoiceItem.forEach((item: any) => {
                const name = item.product.name;
                if (!items[name]) items[name] = { name, quantity: 0 };
                items[name].quantity += item.quantity;
            });
        });
        return Object.values(items);
    }, [data]);

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">របាយការណ៍ចំណូល</h2>

            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-4 mb-4">
                    <button onClick={() => setQuickRange('today')} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ថ្ងៃនេះ
                    </button>
                    <button onClick={() => setQuickRange('7d')} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ៧ ថ្ងៃចុងក្រោយ
                    </button>
                    <button onClick={() => setQuickRange('1m')} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        ១ ខែចុងក្រោយ
                    </button>
                </div>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}

            {/* ✅ Summary */}
            <div className="border p-4 rounded bg-gray-50 space-y-1">
                <h3 className="text-lg font-medium">ទិន្ន័យសង្ខេប</h3>
                <p>🧾 <strong>Invoice Total:</strong> ៛{summary.invoiceTotal} (USD {(summary.invoiceTotal / 4000).toFixed(2)})</p>
                <p>💰 <strong>ចំណូលទទួលបាន:</strong> ៛{summary.totalIncome} (USD {(summary.totalIncome / 4000).toFixed(2)})</p>
                <p>❌ <strong>មិនទាន់ទូទាត់:</strong> ៛{summary.unpaidTotal} (USD {(summary.unpaidTotal / 4000).toFixed(2)})</p>
                <p>
                    {Object.entries(summary.methodTotals).map(([method, amount]) => (
                        <span key={method} className="block">
                            {method}: ៛{amount} (USD{(amount / 4000).toFixed(2)})
                        </span>
                    ))}
                </p>
            </div>

            {/* Daily Table */}
            <div>
                <h3 className="text-lg font-medium">By Date</h3>
                <table className="w-full text-sm border mt-2">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Date</th>
                            {Object.keys(summary.methodTotals).map((method) => (
                                <th key={method} className="p-2 text-right">{method}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(summary.daily).map(([date, methods]) => (
                            <tr key={date} className="border-t">
                                <td className="p-2">{date}</td>
                                {Object.keys(summary.methodTotals).map((method) => (
                                    <td key={method} className="p-2 text-right">
                                        ៛{methods[method]?.toFixed(2) || '0.00'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sold Items */}
            <div>
                <h3 className="text-lg font-medium mt-6">ទំនិញដែលលក់បាន</h3>
                <table className="w-full text-sm border mt-2">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">ឈ្មោះ</th>
                            <th className="p-2 text-right">ចំនួន</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allItems.map((item) => (
                            <tr key={item.name} className="border-t">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

