import type TextField from "@mui/material/TextField";

export type FormValues = Record<string, string | number | boolean | null | undefined>;

export type FormField<T extends FormValues> = {
    name: keyof T;
    label: string;
    type?: 'text' | 'email' | 'tel' | 'number' | 'date';
    required?: boolean;
    inputProps?: Omit<React.ComponentProps<typeof TextField>, 'name' | 'label' | 'onChange' | 'value'>;
};

export type DataFormProps<T extends FormValues> = {
    initialValues?: Partial<T>;
    onSubmit: (values: T) => void;
    onCancel: () => void;
    fields: FormField<T>[];
    isLoading?: boolean;
};