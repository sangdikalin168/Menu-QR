export const usePaginatedData = <T extends { id: number }>(
    data: T[],
    itemsPerPage: number = 10,
    currentPage: number = 1
) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
        paginatedData,
        totalPages,
        currentPage,
        goToPage: (newPage: number) => Math.min(Math.max(newPage, 1), totalPages),
    };
};