import axiosInstance from './axiosConfig';

export interface Product {
  id: number;
  name: string;
  brand: string;
  description?: string;
  price: number;
  image_url?: string;
  barcode?: string;
  category?: string;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export const productsApi = {
  getPaginatedProducts: async (page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<Product>>('/products', {
      params: { page, limit }
    });
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await axiosInstance.get<Product>(`/product/${id}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await axiosInstance.get<Product[]>('/products/searchProducts', {
      params: { query }
    });
    return response.data;
  },

  getBrands: async (page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get('/products/getBrands', {
      params: { page, limit }
    });
    return response.data;
  },

  createProduct: async (productData: Partial<Product>) => {
    const response = await axiosInstance.post<Product>('/', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    const response = await axiosInstance.put<Product>(`/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  }
};
