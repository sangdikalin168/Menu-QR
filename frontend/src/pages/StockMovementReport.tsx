import { isValid, parseISO, format } from 'date-fns';
import { useStockMovementReportQuery } from '../generated/graphql';

interface Props {
  dateRange: { start: Date; end: Date } | null;
  categoryId: number | null;
}

export const StockMovementReport = ({ dateRange, categoryId }: Props) => {
  const { data, loading, error } = useStockMovementReportQuery({
    variables: {
      startDate: dateRange?.start.toISOString() ?? null,
      endDate: dateRange?.end.toISOString() ?? null,
      categoryId,
    },
    skip: !dateRange,
  });

  if (loading) return <p className="text-sm text-gray-500">Loading stock movement...</p>;
  if (error) return <p className="text-sm text-red-500">Error: {error.message}</p>;

  const movements = data?.stockMovementReport || [];

  if (movements.length === 0) {
    return <p className="text-sm text-gray-400 italic">No stock movements found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Change</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Reason</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((item: any, index: number) => (
            <tr key={index} className="border-t">
              <td className="p-2 whitespace-nowrap">
                {item.createdAt && isValid(parseISO(item.createdAt))
                  ? format(parseISO(item.createdAt), 'yyyy-MM-dd HH:mm')
                  : '—'}
              </td>
              <td className="p-2 whitespace-nowrap">{item.product.name}</td>
              <td className="p-2 whitespace-nowrap">{item.changeQuantity}</td>
              <td className="p-2 whitespace-nowrap">{item.logType}</td>
              <td className="p-2 whitespace-nowrap">{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
