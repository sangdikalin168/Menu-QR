export type TableColumn<T> = {
    key: KeyOfType<T>;
    label: string;
    render?: (item: T) => React.ReactNode;
};

export type KeyOfType<T> = {
    [K in keyof T]: K;
}[keyof T];