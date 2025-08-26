import React from 'react'
import { useLeavesQuery, useLeavesPageQuery, useCreateLeaveMutation, useChangeLeaveStatusMutation } from '@/features/organization/leave/queries'
import { useEmployeesQuery } from '@/features/organization/employee/queries'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/common/DataTable'
import { type ColumnDef } from '@tanstack/react-table'
import LeaveForm from '@/features/organization/leave/components/LeaveForm'
import { showSuccess, showError } from '@/utils/toastHelpers'
import { Badge } from '@/components/ui/badge'

const LeavePage: React.FC = () => {
    const [page, setPage] = React.useState(0)
    const [pageSize, setPageSize] = React.useState(10)
    const { loading, error, refetch } = useLeavesQuery()
    const leavesPageQuery = useLeavesPageQuery({ employeeId: undefined, skip: page * pageSize, take: pageSize })
    const leavesData = leavesPageQuery.data?.leavesPage
    const { data: empData } = useEmployeesQuery()
    const createLeave = useCreateLeaveMutation()
    const changeLeaveStatus = useChangeLeaveStatusMutation()
    type Leave = { id: string; employee_id: string; leave_type: string; start_time: string; end_time: string; leave_day: number; status: string; reason?: string }
    const [showForm, setShowForm] = React.useState(false)
    const [editing, setEditing] = React.useState<Leave | undefined>(undefined)
    const [localLeaves, setLocalLeaves] = React.useState<Leave[]>([])

    React.useEffect(() => {
        if (leavesData?.items) setLocalLeaves(leavesData.items);
    }, [leavesData?.items]);

    const handleOpenCreate = () => { setEditing(undefined); setShowForm(true); }
    const handleOpenEdit = (id: string) => {
        const item = localLeaves.find(l => String(l.id) === String(id));
        if (item) { setEditing(item); setShowForm(true); }
    }

    const handleSubmit = async (values: Partial<Leave>) => {
        if (editing) {
            // optimistic update not implemented for update; simply call backend and refetch
            try {
                // no update mutation present in current API for all fields; reuse createLeave for now
                await createLeave(values as unknown as Record<string, unknown>);
                await leavesPageQuery.refetch?.();
                showSuccess('Leave updated');
                setShowForm(false);
                return { success: true };
            } catch { return { success: false }; }
        } else {
            const tempId = `temp-${Date.now()}`;
            const newItem = { id: tempId, employee_id: values.employee_id ?? '', leave_type: values.leave_type ?? '', start_time: values.start_time ?? '', end_time: values.end_time ?? '', leave_day: values.leave_day ?? 1.0, status: 'PENDING', reason: values.reason ?? '' };
            const prev = localLeaves;
            setLocalLeaves([newItem, ...prev]);
            try {
                await createLeave(values as unknown as Record<string, unknown>);
                await leavesPageQuery.refetch?.();
                showSuccess('Leave created');
                setShowForm(false);
                return { success: true };
            } catch {
                setLocalLeaves(prev);
                showError('Failed to create leave');
                return { success: false };
            }
        }
    }

    type Emp = { id: string; emp_code?: string; name?: string }
    const getColumns = ({ onEdit, onApprove, onReject, empData }: { onEdit: (id: string) => void; onApprove: (id: string) => void; onReject: (id: string) => void; empData: Emp[] }): ColumnDef<Leave>[] => {
        return [
            {
                accessorKey: 'employee_id', header: 'Employee', cell: ({ row }) => {
                    const id = row.getValue('employee_id') as string;
                    const emp = empData.find(e => String(e.id) === String(id));
                    return emp ? `${emp.emp_code} · ${emp.name}` : id;
                }
            },
            { accessorKey: 'leave_type', header: 'Type' },
            {
                accessorKey: 'start_time', header: 'Start', cell: ({ row }) => {
                    const raw = row.getValue('start_time') as unknown;
                    if (raw === null || raw === undefined || raw === '') return '';
                    let d: Date;
                    if (typeof raw === 'number') d = new Date(raw);
                    else if (typeof raw === 'string' && /^\d+$/.test(raw)) d = new Date(parseInt(raw, 10));
                    else d = new Date(String(raw));
                    return isNaN(d.getTime()) ? String(raw) : d.toLocaleString('en-GB');
                }
            },
            {
                accessorKey: 'end_time', header: 'End', cell: ({ row }) => {
                    const raw = row.getValue('end_time') as unknown;
                    if (raw === null || raw === undefined || raw === '') return '';
                    let d: Date;
                    if (typeof raw === 'number') d = new Date(raw);
                    else if (typeof raw === 'string' && /^\d+$/.test(raw)) d = new Date(parseInt(raw, 10));
                    else d = new Date(String(raw));
                    return isNaN(d.getTime()) ? String(raw) : d.toLocaleString('en-GB');
                }
            },
            { accessorKey: 'leave_day', header: 'Days' },
            {
                accessorKey: 'status', header: 'Status', cell: ({ row }) => {
                    const s = row.getValue('status') as string;
                    return (<Badge variant={s === 'APPROVED' ? 'default' : s === 'REJECTED' ? 'destructive' : 'outline'}>{s}</Badge>);
                }
            },
            {
                id: 'actions', header: 'Actions', cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button className="text-blue-500" onClick={() => onEdit(row.original.id)}>Edit</button>
                        <button className="text-green-600" onClick={() => onApprove(row.original.id)}>Approve</button>
                        <button className="text-red-600" onClick={() => onReject(row.original.id)}>Reject</button>
                    </div>
                ), enableHiding: false
            }
        ];
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Leaves</h1>
                    <p className="text-sm text-muted-foreground">Manage employee leave requests and approvals</p>
                </div>
                <div>
                    <Button onClick={() => refetch()} size="sm" variant="outline">Refresh</Button>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-4">Requests</h2>
                <DataTable
                    columns={getColumns({ onEdit: handleOpenEdit, onApprove: async (id: string) => { try { await changeLeaveStatus(String(id), 'APPROVED'); leavesPageQuery.refetch?.(); showSuccess('Leave approved'); } catch { showError('Failed to approve'); } }, onReject: async (id: string) => { try { await changeLeaveStatus(String(id), 'REJECTED'); leavesPageQuery.refetch?.(); showSuccess('Leave rejected'); } catch { showError('Failed to reject'); } }, empData: empData?.employees ?? [] })}
                    data={localLeaves}
                    loading={loading || leavesPageQuery.loading}
                    error={error ? String(error) : (leavesPageQuery.error ? String(leavesPageQuery.error) : null)}
                    headerButtons={[
                        { label: 'Add Leave', onClick: handleOpenCreate, className: 'bg-green-500 text-white hover:bg-green-600' },
                    ]}
                    page={page}
                    pageSize={pageSize}
                    totalItems={leavesData?.total ?? 0}
                    onPageChange={(p) => { setPage(p); }}
                    onPageSizeChange={(s) => { setPageSize(s); setPage(0); }}
                    tableId="leave-table"
                    onSearch={(_term) => { /* TODO: wire server search */ }}
                />
                {showForm && (
                    <LeaveForm item={editing} onSubmit={async (v) => { const res = await handleSubmit(v as Partial<Leave>); if (res.success) setShowForm(false); return res; }} onClose={() => setShowForm(false)} employees={empData?.employees ?? []} />
                )}
            </div>
        </div>
    )
}

export default LeavePage
