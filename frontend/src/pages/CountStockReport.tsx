import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import LoadingPage from '../components/ui/LoadingPage';

interface CountStockItem {
    product: string;
    saleInPcs: number;
    currentStockInPcs: number;
    hasBoxes: boolean;
    pcsPerBox: number;
    unitName: string;
    boxUnitName: string | null;
}

interface CountStockReportProps {
    categoryId: number | null;
    dateRange: { start: Date; end: Date } | null;
}

// GraphQL Query
const COUNT_STOCK_REPORT = gql`
    query CountStockReport($categoryId: Int, $startDate: DateTime, $endDate: DateTime) {
        countStockReport(categoryId: $categoryId, startDate: $startDate, endDate: $endDate) {
            product
            saleInPcs
            currentStockInPcs
            hasBoxes
            pcsPerBox
            unitName
            boxUnitName
        }
    }
`;


function formatQuantity(
    quantity: number,
    hasBoxes: boolean,
    pcsPerBox: number,
    unitName: string,
    boxUnitName: string
): string {
    if (!hasBoxes || pcsPerBox <= 1) {
        return `${quantity} ${unitName}`;
    }

    const boxes = Math.floor(quantity / pcsPerBox);
    const remaining = quantity % pcsPerBox;

    if (remaining === 0) {
        return `${boxes} ${boxUnitName}`;
    }

    return `${boxes} ${boxUnitName} & ${remaining} ${unitName}`;
}

export const CountStockReport: React.FC<CountStockReportProps> = ({ categoryId, dateRange }) => {
    const { loading, error, data } = useQuery(COUNT_STOCK_REPORT, {
        variables: {
            categoryId: categoryId || undefined,
            startDate: dateRange?.start.toISOString() || undefined,
            endDate: dateRange?.end.toISOString() || undefined,
        },
        skip: !dateRange,
    });

    if (loading) return <LoadingPage />;
    if (error) return <p>Error loading stock report: {error.message}</p>;

    const reportData = data?.countStockReport || [];

    return (
        <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => {
                        const table = document.getElementById('stock-report-table');
                        if (!table) return;

                        // Clone table to avoid modifying original
                        const printableTable = table.cloneNode(true) as HTMLElement;

                        // Optional: Remove any unwanted elements like buttons from the print version
                        const buttons = printableTable.querySelectorAll('button, .no-print');
                        buttons.forEach((btn) => btn.remove());
                        const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Count Stock Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 10px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 6px;
                            border: 1px solid #333;
                            font-size: 12px;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        @media print {
                            @page {
                                margin: 5mm;
                            }
                            body {
                                font-size: 12pt;
                            }
                        }
                    </style>
                </head>
                <body>
                    <h2>Count Stock Report</h2>
                    ${printableTable.outerHTML}
                </body>
                </html>
            `;

                        if (window.electronAPI?.printReceipt) {
                            window.electronAPI.printReceipt(htmlContent);
                        } else {
                            console.error('Electron print API not available');
                        }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Print Report
                </button>
            </div>
            <div id="stock-report-table" className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 py-2">Product</th>
                            <th className="px-4 py-2">Sale</th>
                            <th className="px-4 py-2">Current Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((item: CountStockItem, index: number) => (
                            <tr key={index} className="border-t">
                                <td className="px-4 py-2">{item.product}</td>
                                <td className="px-4 py-2">
                                    {formatQuantity(
                                        item.saleInPcs,
                                        item.hasBoxes,
                                        item.pcsPerBox,
                                        item.unitName,
                                        item.boxUnitName
                                    )}
                                </td>
                                <td className="px-4 py-2">
                                    {formatQuantity(
                                        item.currentStockInPcs,
                                        item.hasBoxes,
                                        item.pcsPerBox,
                                        item.unitName,
                                        item.boxUnitName
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};