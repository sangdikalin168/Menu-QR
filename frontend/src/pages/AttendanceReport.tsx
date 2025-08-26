import React from 'react';
import { useAttendanceForDayQuery } from '@/features/organization/fingerprint/queries';
import DataTable from '@/components/common/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

type Fingerprint = {
    id: string;
    emp_code: string;
    punch_time: unknown;
    name?: string;
    status?: string;
    clock_in?: string | null;
    clock_out?: string | null;
};

// ...existing code...

export const AttendanceReport: React.FC = () => {
    const [date, setDate] = React.useState<string>(new Date().toISOString().slice(0, 10));
    const dateIso = React.useMemo(() => new Date(date + 'T00:00:00.000Z').toISOString().slice(0, 10), [date]);

    // pagination state
    const [page, setPage] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(20);

    const { data: attendanceData, loading, error, refetch } = useAttendanceForDayQuery({ date: dateIso, skip: page * pageSize, take: pageSize });

    const employeeRows: Fingerprint[] = React.useMemo(() => {
        const items = (attendanceData?.attendanceForDay ?? []) as Array<Record<string, unknown>>;
        return items.map((it) => ({
            id: String(it['id'] ?? ''),
            emp_code: String(it['emp_code'] ?? ''),
            name: String(it['name'] ?? ''),
            punch_time: null,
            clock_in: it['clock_in'] ?? null,
            clock_out: it['clock_out'] ?? null,
            status: String(it['status'] ?? 'Absent'),
        } as Fingerprint));
    }, [attendanceData]);
    const formatDate = (d: Date) => {
        // Format as DD/MM/YYYY HH:mm:ss (day first)
        try {
            return d.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });
        } catch {
            return d.toString();
        }
    };

    const columns: ColumnDef<Fingerprint>[] = [
        { accessorKey: 'id', header: 'ID' },
        { accessorKey: 'emp_code', header: 'Employee Code' },
        { accessorKey: 'name', header: 'Name' },
        {
            accessorKey: 'clock_in',
            header: 'Clock In',
            cell: ({ row }) => {
                const v = row.original.clock_in;
                if (v === null || v === undefined || v === '') return '';
                const asNum = Number(v);
                if (!Number.isNaN(asNum) && asNum > 0) {
                    const d = new Date(asNum);
                    if (!Number.isNaN(d.getTime())) return formatDate(d);
                }
                const d1 = new Date(String(v));
                if (!Number.isNaN(d1.getTime())) return formatDate(d1);
                const d2 = new Date(String(v).replace(' ', 'T'));
                if (!Number.isNaN(d2.getTime())) return formatDate(d2);
                return String(v);
            },
        },
        {
            accessorKey: 'clock_out',
            header: 'Clock Out',
            cell: ({ row }) => {
                const v = row.original.clock_out;
                if (v === null || v === undefined || v === '') return '';
                const asNum = Number(v);
                if (!Number.isNaN(asNum) && asNum > 0) {
                    const d = new Date(asNum);
                    if (!Number.isNaN(d.getTime())) return formatDate(d);
                }
                const d1 = new Date(String(v));
                if (!Number.isNaN(d1.getTime())) return formatDate(d1);
                const d2 = new Date(String(v).replace(' ', 'T'));
                if (!Number.isNaN(d2.getTime())) return formatDate(d2);
                return String(v);
            },
        },
        { accessorKey: 'status', header: 'Status' },
    ];

    const onSearch = undefined;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Daily Attendance Report</h1>
                <div className="flex items-center gap-2">
                    <Input type="date" value={date} onChange={(e) => { const d = e.target.value; setDate(d); const s = new Date(d + 'T00:00:00.000Z').toISOString().slice(0, 10); refetch?.({ date: s, skip: page * pageSize, take: pageSize }); }} />
                </div>
            </div>



            <DataTable
                columns={columns}
                data={employeeRows}
                loading={loading}
                error={error?.message || null}
                totalItems={employeeRows.length}
                page={page}
                pageSize={pageSize}
                onSearch={onSearch}
                onPageChange={(p) => { setPage(p); }}
                onPageSizeChange={(s) => { setPageSize(s); setPage(0); }}
                tableId="attendance-report-table"
            />
        </div>
    );
};

export default AttendanceReport;
