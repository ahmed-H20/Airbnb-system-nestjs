export interface Filters {
  search?: string;
}

export interface Options {
  sortBy?: string;
  sortOrder?: 1 | -1;
  page?: number;
  limit?: number;
}
