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

import type { Product } from "../generated/graphql";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const ProductDialogForm: React.FC<{ refetch: () => void; open: boolean; setOpen: (v: boolean) => void; editProduct?: Product | null }> = ({ refetch, open, setOpen, editProduct }) => {
    const [name, setName] = useState(editProduct?.name || "");
    const [price, setPrice] = useState<number>(editProduct ? editProduct.price : 0);
    const [categories, setCategories] = useState<string[]>(editProduct?.categories?.map(c => c.id.toString()) || []);
    const [enabled, setEnabled] = useState(editProduct?.enabled ?? true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [createProduct, { loading: creating }] = useCreateProductMutation();
    const [updateProduct, { loading: updating }] = useUpdateProductMutation();
    const categoryOptions = useCategoryOptions();

    React.useEffect(() => {
        setName(editProduct?.name || "");
        setPrice(editProduct ? editProduct.price : 0);
        setCategories(editProduct?.categories?.map(c => c.id.toString()) || []);
        setEnabled(editProduct?.enabled ?? true);
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
                            categories,
                            enabled,
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
                            categories,
                            image: editProduct.image,
                            enabled,
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
                        categories,
                        enabled,
                        // Do not send image, let backend handle file upload
                    },
                    file: imageFile,
                },
            });
        }
        setName("");
        setPrice(0);
        setCategories([]);
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
                    <div className="flex items-center gap-2">
                        <label htmlFor="enabled" className="font-medium">Enabled:</label>
                        <input
                            id="enabled"
                            type="checkbox"
                            checked={enabled}
                            onChange={e => setEnabled(e.target.checked)}
                        />
                        <span className={enabled ? "text-green-600" : "text-red-600"}>{enabled ? "Enabled" : "Disabled"}</span>
                    </div>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger className="border rounded px-2 py-1 w-full">
                            {categories.length > 0
                                ? categoryOptions.filter(opt => categories.includes(String(opt.value))).map(opt => opt.label).join(", ")
                                : "Select categories"}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {categoryOptions.map(opt => (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() => {
                                        if (!categories.includes(String(opt.value))) {
                                            setCategories([...categories, String(opt.value)]);
                                        }
                                    }}
                                    className={categories.includes(String(opt.value)) ? "bg-blue-100 font-semibold" : ""}
                                >
                                    {opt.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="flex justify-center">
                        <img src={imagePreview ? (imagePreview.startsWith('/uploads/') ? `${API_URL}${imagePreview}` : imagePreview) : '/public/default-product.png'} alt="Preview" className="w-32 h-32 object-cover rounded border" />
                    </div>
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


export default function ProductPage() {
    const { data, loading, error, refetch } = useProductsQuery();
    const products = data?.products ?? [];
    const [openDialog, setOpenDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [search, setSearch] = useState("");

    const filteredProducts = products.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
        const categoryMatch = p.categories?.some(c => c.name.toLowerCase().includes(search.toLowerCase()));
        return nameMatch || categoryMatch;
    });

    const columns: ColumnDef<Product>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "price", header: "Price" },
        { accessorKey: "categories", header: "Categories", cell: ({ row }) => row.original.categories?.map(c => c.name).join(", ") ?? "" },
        {
            accessorKey: "image", header: "Image", cell: ({ row }) => (
                <img src={row.original.image ? (row.original.image.startsWith('/uploads/') ? `${API_URL}${row.original.image}` : row.original.image) : '/public/default-product.png'} alt={row.original.name} className="w-12 h-12 object-cover rounded" />
            )
        },
        {
            accessorKey: "enabled", header: "Status", cell: ({ row }) => (
                <span className={row.original.enabled ? "text-green-600" : "text-red-600"}>{row.original.enabled ? "Enabled" : "Disabled"}</span>
            )
        },
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
                data={filteredProducts.map(p => ({ ...p, image: p.image ?? "" }))}
                loading={loading}
                error={error?.message}
                tableId="product-table"
                searchTerm={search}
                onSearch={setSearch}
            />
        </div>
    );
}
