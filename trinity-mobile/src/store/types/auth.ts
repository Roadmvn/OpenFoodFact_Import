export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'seller' | 'buyer';
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  isUpdating?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  city?: string;
  country?: string;
}
