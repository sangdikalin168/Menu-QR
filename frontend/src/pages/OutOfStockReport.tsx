// src/components/reports/OutOfStockReport.tsx
import { useOutOfStockProductsQuery } from '../generated/graphql';

type Props = {
  categoryId?: number | null;
};

export const OutOfStockReport = ({ categoryId }: Props) => {
  const { data, loading, error } = useOutOfStockProductsQuery( {
    variables: { categoryId: categoryId ?? null },
  });

  const products = data?.outOfStockProducts || [];

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error loading out-of-stock products</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">All products are in stock 🎉</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category?.name || '-'}</td>
                <td className="px-3 py-2 text-red-600 font-semibold">
                  {product.stock?.quantity ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
