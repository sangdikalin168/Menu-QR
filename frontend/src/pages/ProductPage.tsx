import React, { useState } from "react";
import DataTable from "../components/common/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "../components/ui/dialog";
import { useCreateProductMutation, useProductsQuery, useUpdateProductMutation } from "../generated/graphql";
import { useCategoryOptions } from "../hooks/useCategoryOptions";

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

// Product type
type Product = {
    id: number;
    name: string;
    price: number;
    categories: { id: number; name: string }[];
    image: string;
};

export const ProductDialogForm: React.FC<{ refetch: () => void; open: boolean; setOpen: (v: boolean) => void; editProduct?: Product | null }> = ({ refetch, open, setOpen, editProduct }) => {
    const [name, setName] = useState(editProduct?.name || "");
    const [price, setPrice] = useState<number>(editProduct ? editProduct.price : 0);
    const [category, setCategory] = useState<string>(editProduct?.categories?.[0]?.id.toString() || "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [createProduct, { loading: creating }] = useCreateProductMutation();
    const [updateProduct, { loading: updating }] = useUpdateProductMutation();
    const categoryOptions = useCategoryOptions();

    React.useEffect(() => {
        setName(editProduct?.name || "");
        setPrice(editProduct ? editProduct.price : 0);
        setCategory(editProduct?.categories?.[0]?.id.toString() || "");
        setImageFile(null);
        setImagePreview(editProduct?.image || null);
    }, [editProduct, open]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editProduct) {
            if (imageFile) {
                await updateProduct({
                    variables: {
                        id: editProduct.id,
                        input: {
                            name,
                            price: price,
                            categories: [category],
                            // Do not send image, let backend handle file upload
                        },
                        file: imageFile,
                    },
                });
            } else {
                await updateProduct({
                    variables: {
                        id: editProduct.id,
                        input: {
                            name,
                            price: price,
                            categories: [category],
                            image: editProduct.image,
                        },
                    },
                });
            }
        } else {
            await createProduct({
                variables: {
                    input: {
                        name,
                        price: price,
                        categories: [category],
                        // Do not send image, let backend handle file upload
                    },
                    file: imageFile,
                },
            });
        }
        setName("");
        setPrice(0);
        setCategory("");
        setImageFile(null);
        setImagePreview(null);
        setOpen(false);
        refetch();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent aria-describedby="product-dialog-desc">
                <DialogHeader>
                    <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogHeader>
                <p id="product-dialog-desc" className="sr-only">
                    Fill out the product details and upload an image.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required
                    />
                    <Input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(parseFloat(e.target.value) || 0)}
                        required
                    />
                    <select
                        className="border rounded px-2 py-1 w-full"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        {categoryOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {imagePreview && (
                        <div className="flex justify-center">
                            <img src={imagePreview.startsWith('/uploads/') ? `${API_URL}${imagePreview}` : imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="submit" disabled={creating || updating}>
                            {creating || updating
                                ? (editProduct ? "Save" : "Create Product")
                                : (editProduct ? "Save" : "Create Product")}
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

// Example usage in your ProductPage component:
// <ProductCreateForm />

// Mock product data

export default function ProductPage() {
    const { data, loading, error, refetch } = useProductsQuery();
    const products = data?.products ?? [];
    const [openDialog, setOpenDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const columns: ColumnDef<Product>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "categories", header: "Category", cell: ({ row }) => row.original.categories?.[0]?.name ?? "" },
        { accessorKey: "image", header: "Image", cell: ({ row }) => (
            <img src={row.original.image.startsWith('/uploads/') ? `${API_URL}${row.original.image}` : row.original.image} alt={row.original.name} className="w-12 h-12 object-cover rounded" />
        ) },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Button variant="ghost" size="icon" onClick={() => {
                    setEditProduct(row.original);
                    setOpenDialog(true);
                }} title="Edit">
                    ✏️
                </Button>
            ),
        },
    ];

    const handleAdd = () => {
        setEditProduct(null);
        setOpenDialog(true);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Product Management</h1>
            <Button className="mb-4" onClick={handleAdd}>Add Product</Button>
            <ProductDialogForm refetch={refetch} open={openDialog} setOpen={setOpenDialog} editProduct={editProduct} />
            <DataTable
                columns={columns}
                data={products.map(p => ({ ...p, image: p.image ?? "" }))}
                loading={loading}
                error={error?.message}
                tableId="product-table"
            />
        </div>
    );
}
