import React from "react";
import DataTable from "@/components/common/DataTable";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { type ColumnDef } from "@tanstack/react-table";
import { useDepartmentsQuery, useCreateDepartmentMutation, useUpdateDepartmentMutation, useDeleteDepartmentMutation } from "../queries";
import { DepartmentForm } from "../components/DepartmentForm";
import { showSuccess, showError } from '@/utils/toastHelpers';

type Department = {
    id: string;
    name: string;
    description?: string;
};

const DepartmentPage: React.FC = () => {
    const [showForm, setShowForm] = React.useState(false);
    const [editingDepartment, setEditingDepartment] = React.useState<Department | undefined>(undefined);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { data, loading, error, refetch } = useDepartmentsQuery();
    const createDepartment = useCreateDepartmentMutation();
    const updateDepartment = useUpdateDepartmentMutation();
    const deleteDepartment = useDeleteDepartmentMutation();

    const handleEdit = (id: string) => {
        const dept = data?.departments.find((d: Department) => d.id === id);
        if (dept) {
            setEditingDepartment(dept);
            setShowForm(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDepartment(id);
            refetch();
            showSuccess("Department deleted successfully");
        } catch {
            showError("Failed to delete department");
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingDepartment(undefined);
    };

    const handleSubmit = async (values: { name: string; description?: string }) => {
        try {
            if (editingDepartment) {
                await updateDepartment(editingDepartment.id, values);
                showSuccess("Department updated successfully");
            } else {
                await createDepartment(values);
                showSuccess("Department created successfully");
            }
            refetch();
            handleCloseForm();
            return { success: true };
        } catch {
            showError("Failed to save department");
            return { success: false };
        }
    };

    const columns: ColumnDef<Department>[] = [
        {
            accessorKey: "id",
            header: "ID",
            enableHiding: true,
            enableSorting: true,
        },
        {
            accessorKey: "name",
            header: "Name",
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "description",
            header: "Description",
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: { original: Department } }) => (
                <>
                    <button className="text-blue-500 mr-2" onClick={() => handleEdit(row.original.id)}>Edit</button>
                    <button className="text-red-500" onClick={() => handleDelete(row.original.id)}>Delete</button>
                </>
            ),
            enableHiding: false,
        },
    ];

    const headerButtons = [
        {
            label: "Add Department",
            onClick: () => setShowForm(true),
            className: "bg-green-500 text-white hover:bg-green-600",
            icon: <PlusCircleIcon className="h-5 w-5" />,
        },
    ];

    const filteredDepartments = React.useMemo(() => {
        if (!data?.departments) return [];
        if (!searchTerm) return data.departments;
        return data.departments.filter((d: Department) =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
    }, [data?.departments, searchTerm]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Departments</h1>
            <DataTable
                columns={columns}
                data={filteredDepartments}
                headerButtons={headerButtons}
                loading={loading}
                error={error ? error.message : null}
                tableId="department-table"
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />
            {showForm && (
                <DepartmentForm
                    item={editingDepartment}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default DepartmentPage;
