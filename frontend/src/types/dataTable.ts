export type Column<T> = {
    key: keyof T;
    label: string;
};

export type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (id: number) => void;
    idKey?: keyof T; // Default is 'id'
    title?: string;
    loading?: boolean;
};