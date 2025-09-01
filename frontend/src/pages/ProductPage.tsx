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
import { useCreateProductMutation, useProductsQuery, useUpdateProductMutation, SortOrder } from "../generated/graphql";
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
                    <div className="space-y-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="border rounded px-2 py-1 w-full text-left">
                                {categories.length > 0
                                    ? `${categories.length} categories selected`
                                    : "Select categories"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {categoryOptions.map(opt => (
                                    <DropdownMenuItem
                                        key={opt.value}
                                        onClick={() => {
                                            const categoryId = String(opt.value);
                                            if (categories.includes(categoryId)) {
                                                // Remove category (deselect)
                                                setCategories(categories.filter(id => id !== categoryId));
                                            } else {
                                                // Add category (select)
                                                setCategories([...categories, categoryId]);
                                            }
                                        }}
                                        className={categories.includes(String(opt.value)) ? "bg-blue-100 font-semibold" : ""}
                                    >
                                        <span className="mr-2">
                                            {categories.includes(String(opt.value)) ? "✓" : "○"}
                                        </span>
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                                {categories.length > 0 && (
                                    <>
                                        <div className="border-t my-1"></div>
                                        <DropdownMenuItem
                                            onClick={() => setCategories([])}
                                            className="text-red-600 font-semibold"
                                        >
                                            🗑️ Clear all categories
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {/* Display selected categories with individual remove buttons */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50">
                                {categories.map(categoryId => {
                                    const category = categoryOptions.find(opt => String(opt.value) === categoryId);
                                    return category ? (
                                        <span
                                            key={categoryId}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                                        >
                                            {category.label}
                                            <button
                                                type="button"
                                                onClick={() => setCategories(categories.filter(id => id !== categoryId))}
                                                className="ml-1 text-blue-600 hover:text-red-600 font-bold"
                                                title="Remove category"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>

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
    const [currentPage, setCurrentPage] = useState(0); // DataTable uses 0-based pagination
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState("");
    
    const { data, loading, error, refetch } = useProductsQuery({
        variables: { 
            pagination: {
                page: currentPage + 1, // Backend uses 1-based pagination
                limit: pageSize,
                sortBy: "name",
                sortOrder: SortOrder.Asc
            }
        },
        errorPolicy: 'all'
    });

    const products = data?.products?.items ?? [];
    const pageInfo = data?.products?.pageInfo;
    
    const [openDialog, setOpenDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // Filter products based on search (client-side for current page)
    const filteredProducts = search 
        ? products.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = p.categories?.some(c => c.name.toLowerCase().includes(search.toLowerCase()));
            return nameMatch || categoryMatch;
        })
        : products;

    // Pagination handlers for DataTable
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage); // DataTable passes 0-based page
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setCurrentPage(0); // Reset to first page when changing page size
        setPageSize(newPageSize);
    };

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
                page={currentPage}
                pageSize={pageSize}
                totalItems={pageInfo?.totalItems || 0}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    );
}
