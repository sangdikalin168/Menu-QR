// src/components/common/DataTable.types.ts
import { type ColumnDef as TanstackColumnDef } from "@tanstack/react-table";
import { type ReactNode } from "react";

export interface ButtonConfig {
    label: string;
    onClick: () => void;
    className?: string;
    icon?: ReactNode;
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary"; // Shadcn UI Button variants
}

export interface DataTableProps<TData> {
    columns: TanstackColumnDef<TData>[];
    data: TData[];
    loading?: boolean;
    error?: string | null;
    headerButtons?: ButtonConfig[];
    page?: number;
    pageSize?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSearch?: (searchTerm: string) => void;
    searchTerm?: string;
    tableId: string;
}