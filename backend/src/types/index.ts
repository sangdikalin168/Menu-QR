// Example custom types for the project
export type ID = string;

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
