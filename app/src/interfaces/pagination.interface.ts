export interface PaginatorType {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    next: number;
    offset: number;
    pageSize: number;
    prev: number;
    slNo: number;
    totalItems: number;
    totalPages: number;
};