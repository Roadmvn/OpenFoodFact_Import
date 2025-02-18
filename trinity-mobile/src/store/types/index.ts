export interface RootState {
  auth: AuthState;
  products: ProductsState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  barcode?: string;
  category?: string;
  brand?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}
