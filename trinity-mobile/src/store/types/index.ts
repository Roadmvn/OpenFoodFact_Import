export interface RootState {
  auth: AuthState;
  products: ProductsState;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  brand: string;
  categories: string[];
  image_url: string;
  energy_kcal: number;
  fat: number;
  proteins: number;
  salt: number;
}
