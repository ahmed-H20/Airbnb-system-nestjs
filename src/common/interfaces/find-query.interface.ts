export interface Filters {
  search?: string;
  // Price range
  minPrice?: number;
  maxPrice?: number;
  // Guest capacity
  adultsCount?: number;
  kidsCount?: number;
  // Unit type
  unitType?: string;
  // Amenities
  hasInternetService?: boolean;
  hasKitchen?: boolean;
  hasPrivateGarage?: boolean;
  // Rating
  minRating?: number;
  // Date availability (exclude units with overlapping accepted reservations)
  checkInDate?: Date;
  checkOutDate?: Date;
}

export interface Options {
  sortBy?: string;
  sortOrder?: 1 | -1;
  page?: number;
  limit?: number;
}
