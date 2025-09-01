import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation } from "../generated/graphql";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "../components/ui/dialog";

import type { Category } from "../generated/graphql";
import { useState } from "react";
import React from "react";
import DataTable from "@/components/common/DataTable";

export const CategoryDialogForm: React.FC<{ refetch: () => void; open: boolean; setOpen: (v: boolean) => void; editCategory?: Category | null }> = ({ refetch, open, setOpen, editCategory }) => {
    const [name, setName] = useState(editCategory?.name || "");
    const [parentId, setParentId] = useState(editCategory?.parentId ? String(editCategory.parentId) : "");
    const [createCategory, { loading: creating }] = useCreateCategoryMutation();
    const [updateCategory, { loading: updating }] = useUpdateCategoryMutation();
    const { data } = useCategoriesQuery();
    const categoryOptions = (data?.categories ?? []).filter(cat => !editCategory || cat.id !== editCategory.id);

    React.useEffect(() => {
        setName(editCategory?.name || "");
        setParentId(editCategory?.parentId ? String(editCategory.parentId) : "");
    }, [editCategory, open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const parentIdValue = parentId ? parentId : null;
        console.log('Submitting category with parentId:', parentIdValue);
        try {
            if (editCategory) {
                await updateCategory({ variables: { id: editCategory.id, input: { name, parentId: parentIdValue } } });
            } else {
                await createCategory({ variables: { input: { name, parentId: parentIdValue } } });
            }
            setName("");
            setParentId("");
            setOpen(false);
            refetch();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={parentId}
                        onChange={e => setParentId(e.target.value)}
                    >
                        <option value="">No Parent (Top Level)</option>
                        {categoryOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    <DialogFooter>
                        <Button type="submit" disabled={creating || updating}>
                            {(creating || updating) ? (editCategory ? "Saving..." : "Creating...") : (editCategory ? "Save" : "Create Category")}
                        </Button>
                        <DialogClose asChild>
                            <Button variant="ghost" type="button">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const CategoryPage: React.FC = () => {
    const { data, loading, error, refetch } = useCategoriesQuery();
    const categories = data?.categories ?? [];
    const [openDialog, setOpenDialog] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const handleAdd = () => {
        setEditCategory(null);
        setOpenDialog(true);
    };

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setOpenDialog(true);
    };

    const columns: ColumnDef<Category>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "parent", header: "Parent Category", cell: ({ row }) => row.original.parent?.name ?? "" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Category Management</h1>
            <Button className="mb-4" onClick={handleAdd}>Add Category</Button>
            <CategoryDialogForm refetch={refetch} open={openDialog} setOpen={setOpenDialog} editCategory={editCategory} />
            <DataTable
                columns={columns}
                data={categories}
                loading={loading}
                error={error?.message}
                tableId="category-table"
            />
        </div>
    );
};

export default CategoryPage;
