export const matchesSearch = <T extends { id: number }>(item: T, searchTerm: string): boolean => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();

    return Object.entries(item).some(([_, value]: [string, unknown]) => {
        if (typeof value === 'string') {
            return value.toLowerCase().includes(search);
        }
        return false;
    });
};