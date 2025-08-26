import LoadingSpinner from '../components/LoadingSpinner';
import { useLowStockProductsQuery } from '../generated/graphql';

interface LowStockReportProps {
    categoryId?: number | null;
}

export const LowStockReport = ({ categoryId }: LowStockReportProps) => {
    const { data, loading, error } = useLowStockProductsQuery({
        fetchPolicy: 'cache-and-network',
    });

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">Error loading low stock report.</p>;

    const products = data?.lowStockProducts || [];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">Product</th>
                        <th className="px-4 py-2">Stock</th>
                        <th className="px-4 py-2">Alert Level</th>
                        <th className="px-4 py-2">Category</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: any) => (
                        <tr key={product.id} className="border-b">
                            <td className="px-4 py-2 font-medium">{product.name}</td>
                            <td className="px-4 py-2">{product.stock?.quantity ?? 0}</td>
                            <td className="px-4 py-2">{product.lowStockAlert}</td>
                            <td className="px-4 py-2">{product.category?.name ?? '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
