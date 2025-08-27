import React, { useState } from "react";
import DataTable from "../components/common/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useCategoriesQuery, useCreateCategoryMutation } from "../generated/graphql";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "../components/ui/dialog";

// Category type
interface Category {
    id: number;
    name: string;
}

export const CategoryDialogForm: React.FC<{ refetch: () => void; open: boolean; setOpen: (v: boolean) => void; editCategory?: Category | null }> = ({ refetch, open, setOpen, editCategory }) => {
    const [name, setName] = useState(editCategory?.name || "");
    const [createCategory, { loading }] = useCreateCategoryMutation();

    React.useEffect(() => {
        setName(editCategory?.name || "");
    }, [editCategory, open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await createCategory({ variables: { input: { name } } });
        setName("");
        setOpen(false);
        refetch();
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
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? (editCategory ? "Saving..." : "Creating...") : (editCategory ? "Save" : "Create Category")}
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

const columns: ColumnDef<Category>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
];

const CategoryPage: React.FC = () => {
    const { data, loading, error, refetch } = useCategoriesQuery();
    const categories = data?.categories ?? [];
    const [openDialog, setOpenDialog] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const handleAdd = () => {
        setEditCategory(null);
        setOpenDialog(true);
    };

    // For edit, you would setEditCategory(category) and setOpenDialog(true)

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
