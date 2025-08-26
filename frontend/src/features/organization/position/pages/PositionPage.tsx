import React from "react";
import DataTable from "@/components/common/DataTable";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { type ColumnDef } from "@tanstack/react-table";
import { usePositionsQuery, useCreatePositionMutation, useUpdatePositionMutation, useDeletePositionMutation } from "../queries";
import { PositionForm } from "../components/PositionForm";
import { toast } from "react-toastify";

type Position = {
    id: string;
    name: string;
    description?: string;
};

const PositionPage: React.FC = () => {
    const [showForm, setShowForm] = React.useState(false);
    const [editingPosition, setEditingPosition] = React.useState<Position | undefined>(undefined);
    const [searchTerm, setSearchTerm] = React.useState("");
    const { data, loading, error, refetch } = usePositionsQuery();
    const createPosition = useCreatePositionMutation();
    const updatePosition = useUpdatePositionMutation();
    const deletePosition = useDeletePositionMutation();

    const handleEdit = (id: string) => {
        const pos = data?.positions.find((p: Position) => p.id === id);
        if (pos) {
            setEditingPosition(pos);
            setShowForm(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePosition(id);
            refetch();
            toast.success("Position deleted successfully");
        } catch {
            toast.error("Failed to delete position");
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingPosition(undefined);
    };

    const handleSubmit = async (values: { name: string; description?: string }) => {
        try {
            if (editingPosition) {
                await updatePosition(editingPosition.id, values);
                toast.success("Position updated successfully");
            } else {
                await createPosition(values);
                toast.success("Position created successfully");
            }
            refetch();
            handleCloseForm();
            return { success: true };
        } catch {
            toast.error("Failed to save position");
            return { success: false };
        }
    };

    const columns: ColumnDef<Position>[] = [
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
            cell: ({ row }: { row: { original: Position } }) => (
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
            label: "Add Position",
            onClick: () => setShowForm(true),
            className: "bg-green-500 text-white hover:bg-green-600",
            icon: <PlusCircleIcon className="h-5 w-5" />,
        },
    ];

    const filteredPositions = React.useMemo(() => {
        if (!data?.positions) return [];
        if (!searchTerm) return data.positions;
        return data.positions.filter((p: Position) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
    }, [data?.positions, searchTerm]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Positions</h1>
            <DataTable
                columns={columns}
                data={filteredPositions}
                headerButtons={headerButtons}
                loading={loading}
                error={error ? error.message : null}
                tableId="position-table"
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
            />
            {showForm && (
                <PositionForm
                    item={editingPosition}
                    onSubmit={handleSubmit}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default PositionPage;
