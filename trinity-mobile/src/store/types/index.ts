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
  code: string | null;
  name: string;
  brand: string;
  categories: string;
  labels: string;
  quantity: string | null;
  image_url: string | null;
  image_nutrition_url: string | null;
  // Informations nutritionnelles
  energy_kcal: number | null;
  fat: number | null;
  saturated_fat: number | null;
  carbohydrates: number | null;
  sugars: number | null;
  fiber: number | null;
  proteins: number | null;
  salt: number | null;
  sodium: number | null;
  // Métadonnées
  created_at?: string;
  updated_at?: string;
}
