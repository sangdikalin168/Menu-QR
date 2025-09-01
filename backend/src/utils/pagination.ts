// Backend pagination utility
export interface PaginationArgs {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
  items: T[];
  pageInfo: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}

export function calculatePagination(args: PaginationArgs = {}) {
  const page = Math.max(1, args.page || 1);
  const limit = Math.min(100, Math.max(1, args.limit || 10)); // Max 100 items per page
  const skip = (page - 1) * limit;
  const sortBy = args.sortBy || 'createdAt';
  const sortOrder = args.sortOrder || 'DESC';

  return {
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder.toLowerCase() },
    page,
    limit,
  };
}

export function createPaginationResult<T>(
  items: T[],
  totalItems: number,
  page: number,
  limit: number
): PaginationResult<T> {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    pageInfo: {
      currentPage: page,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      limit,
    },
  };
}
