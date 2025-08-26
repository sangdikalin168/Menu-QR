import React from 'react';
import DataTable from '@/components/common/DataTable';
import TimeTableForm from '../components/TimeTableForm';
import { type ColumnDef } from '@tanstack/react-table';
import { useTimeTables } from '../queries';

type TimeTable = {
    id: string;
    name: string;
    description?: string | null;
    entries?: Array<{ weekday: number; start_time: string; end_time: string; entry_type: string; position: number; created_at?: string; updated_at?: string }> | null;
}

const TimetablesPage: React.FC = () => {
    const { data, loading, error, refetch } = useTimeTables();

    const columns: ColumnDef<TimeTable>[] = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'description', header: 'Description' },
        {
            id: 'clock_in',
            header: 'Clock In',
            cell: ({ row }) => {
                const entries = row.original.entries ?? [];
                // Find first IN entry (position ascending)
                const inEntry = entries.filter(e => e.entry_type === 'IN').sort((a,b)=> (a.position - b.position))[0];
                return inEntry ? `${inEntry.start_time}` : '-';
            }
        },
        {
            id: 'clock_out',
            header: 'Clock Out',
            cell: ({ row }) => {
                const entries = row.original.entries ?? [];
                // Find last OUT entry
                const outEntries = entries.filter(e => e.entry_type === 'OUT').sort((a,b)=> (b.position - a.position));
                const outEntry = outEntries[0];
                if (outEntry) return `${outEntry.end_time}`;
                // fallback: if IN exists but no OUT, show its end_time
                const inEntry = entries.filter(e => e.entry_type === 'IN').sort((a,b)=> (b.position - a.position))[0];
                return inEntry ? inEntry.end_time : '-';
            }
        }
    ];

    const records = data?.timeTables ?? [];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Timetables</h2>
                <TimeTableForm onCreated={() => refetch?.()} />
            </div>
            <DataTable
                columns={columns}
                data={records}
                loading={loading}
                error={error ? error.message : null}
                headerButtons={[]}
                tableId="timetables-table"
            />
        </div>
    );
};

export default TimetablesPage;
