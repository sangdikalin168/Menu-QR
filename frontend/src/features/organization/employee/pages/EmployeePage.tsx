import React from "react";
import DataTable from "@/components/common/DataTable";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { type ColumnDef } from "@tanstack/react-table";
import { useEmployeesQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation } from "../queries";
import { useFingerprintTransactionsQuery } from "../../fingerprint/queries";
import { useDepartmentsQuery } from "../../department/queries";
import { usePositionsQuery } from "../../position/queries";
import EmployeeForm from "../components/EmployeeForm";
import { showSuccess, showError, showInfo } from '@/utils/toastHelpers';

type Employee = {
    id: string;
    emp_code: string;
    name: string;
    phone?: string;
    national_id?: string;
    hire_date?: string;
    position?: { id: string; name: string } | null;
    department?: { id: string; name: string } | null;
    is_resigned: boolean;
};

type EmployeeFormValues = {
    emp_code?: string;
    name?: string;
    phone?: string;
    national_id?: string;
    hire_date?: string;
    position_id?: string;
    department_id?: string;
    position?: { id: string } | null;
    department?: { id: string } | null;
    is_resigned?: boolean;
    [key: string]: unknown;
};

const EmployeePage: React.FC = () => {
    const [showForm, setShowForm] = React.useState(false);
    const [editingEmployee, setEditingEmployee] = React.useState<Employee | undefined>(undefined);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { data, loading, error, refetch } = useEmployeesQuery();
    // backend mutations not available; use optimistic local state
    const createEmployee = useCreateEmployeeMutation();
    const updateEmployee = useUpdateEmployeeMutation();
    const deleteEmployee = useDeleteEmployeeMutation();

    const [localEmployees, setLocalEmployees] = React.useState<Employee[]>([]);

    // initialize local state from server data
    React.useEffect(() => {
        if (data?.employees) {
            setLocalEmployees(data.employees);
        }
    }, [data?.employees]);

    const { data: deptData } = useDepartmentsQuery();
    const { data: posData } = usePositionsQuery();

    const handleEdit = (id: string) => {
        const emp = localEmployees.find((e: Employee) => e.id === id);
        if (emp) {
            setEditingEmployee(emp);
            setShowForm(true);
        }
    };

    const handleDelete = async (id: string) => {
        // optimistic delete locally
        const prev = localEmployees;
        setLocalEmployees(prev.filter(e => e.id !== id));
        showSuccess("Employee removed locally");
        try {
            await deleteEmployee(id);
            // if backend supports later, refetch
            try { await refetch?.(); } catch { /* ignore */ }
        } catch {
            // rollback on failure
            setLocalEmployees(prev);
            showError("Failed to delete employee on backend (rolled back)");
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEmployee(undefined);
    };

    const mapValuesToEmployee = (values: EmployeeFormValues): Partial<Employee> => {
        const getString = (v: unknown) => (v === undefined || v === null) ? '' : String(v);
        const positionId = values.position_id ?? values.position?.id ?? null;
        const departmentId = values.department_id ?? values.department?.id ?? null;
        return {
            emp_code: getString(values.emp_code),
            name: getString(values.name),
            phone: getString(values.phone) || undefined,
            national_id: getString(values.national_id) || undefined,
            hire_date: getString(values.hire_date) || undefined,
            position: positionId ? { id: String(positionId), name: '' } : null,
            department: departmentId ? { id: String(departmentId), name: '' } : null,
            is_resigned: !!values.is_resigned,
        } as Partial<Employee>;
    };

    const handleSubmit = async (values: EmployeeFormValues) => {
        if (editingEmployee) {
            // optimistic update
            const prev = localEmployees;
            const patch = mapValuesToEmployee(values);
            const updated = prev.map(e => e.id === editingEmployee.id ? { ...e, ...patch } as Employee : e);
            setLocalEmployees(updated);
            showSuccess("Employee updated locally");
            try {
                await updateEmployee(editingEmployee.id, values);
                try { await refetch?.(); } catch { /* ignore */ }
            } catch {
                setLocalEmployees(prev);
                showError("Failed to update employee on backend (rolled back)");
                return { success: false };
            }
        } else {
            // optimistic create with temporary id
            const tempId = `temp-${Date.now()}`;
            const patch = mapValuesToEmployee(values);
            const newEmp: Employee = { id: tempId, emp_code: patch.emp_code ?? '', name: patch.name ?? '', phone: patch.phone, national_id: patch.national_id, hire_date: patch.hire_date, position: patch.position ?? null, department: patch.department ?? null, is_resigned: !!patch.is_resigned };
            const prev = localEmployees;
            setLocalEmployees([newEmp, ...prev]);
            showSuccess("Employee created locally");
            try {
                await createEmployee(values);
                try { await refetch?.(); } catch { /* ignore */ }
            } catch {
                setLocalEmployees(prev);
                showError("Failed to create employee on backend (rolled back)");
                return { success: false };
            }
        }
        handleCloseForm();
        return { success: true };
    };

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: "id",
            header: "ID",
            enableHiding: true,
            enableSorting: true,
        },
        {
            accessorKey: "emp_code",
            header: "Code",
            enableSorting: true,
        },
        {
            accessorKey: "name",
            header: "Name",
            enableSorting: true,
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            id: "position",
            header: "Position",
            cell: ({ row }) => ((row.original as Employee).position?.name ?? "-"),
        },
        {
            id: "department",
            header: "Department",
            cell: ({ row }) => ((row.original as Employee).department?.name ?? "-"),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: Employee } }) => (
                <>
                    <button className="text-blue-500 mr-2" onClick={() => handleEdit(row.original.id)}>Edit</button>
                    <button className="text-red-500" onClick={() => handleDelete(row.original.id)}>Delete</button>
                </>
            ),
            enableHiding: false,
        },
    ];

    const { refetch: fingerprintRefetch } = useFingerprintTransactionsQuery();

    const headerButtons = [
        {
            label: "Add Employee",
            onClick: () => setShowForm(true),
            className: "bg-green-500 text-white hover:bg-green-600",
            icon: <PlusCircleIcon className="h-5 w-5" />,
        },
        {
            label: "Fetch Transactions",
            onClick: async () => {
                const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                try {
                    const res = await fingerprintRefetch({ since, limit: 200 });
                    const items = res?.data?.fingerprintTransactions ?? [];
                    showInfo(`Fetched ${items.length} fingerprint transactions`);
                } catch {
                    showError("Failed to fetch fingerprint transactions");
                }
            },
            className: "bg-blue-500 text-white hover:bg-blue-600",
            icon: <PlusCircleIcon className="h-5 w-5" />,
        },
    ];

    const filtered = React.useMemo(() => {
        const pool = localEmployees;
        if (!pool) return [];
        if (!searchTerm) return pool;
        return pool.filter((e: Employee) =>
        ((e.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.emp_code?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (e.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false))
        );
    }, [localEmployees, searchTerm]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Employees</h1>
            <DataTable
                columns={columns}
                data={filtered}
                headerButtons={headerButtons}
                loading={loading}
                error={error ? error.message : null}
                tableId="employee-table"
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />
            {showForm && (
                <EmployeeForm
                    item={editingEmployee}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                    departments={deptData?.departments ?? []}
                    positions={posData?.positions ?? []}
                />
            )}
        </div>
    );
};

export default EmployeePage;
