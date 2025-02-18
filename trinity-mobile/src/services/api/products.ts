import axios from './axiosConfig';
import { Product } from '../../store/types';

interface PaginatedResponse {
  data: Product[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export const productsApi = {
  getPaginatedProducts: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse> => {
    const response = await axios.get(`/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await axios.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await axios.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response = await axios.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await axios.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`/products/${id}`);
  },
};
