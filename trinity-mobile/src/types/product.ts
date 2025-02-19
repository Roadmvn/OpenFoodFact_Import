export interface Product {
  id: number;
  name: string;
  description?: string;
  barcode?: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  nutriscore?: string;
  ingredients?: string;
  allergens?: string;
  createdAt: string;
  updatedAt: string;
}
