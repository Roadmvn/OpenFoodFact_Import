import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsApi } from '@services/api/products';

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
  calories?: number;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  fiber?: number;
  sugar?: number;
  salt?: number;
  energy?: number;
  saturated_fats?: number;
  omega_3?: number;
  omega_6?: number;
  cholesterol?: number;
  sodium?: number;
}

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
};

// Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, query = '' }: { page?: number; query?: string }, { rejectWithValue }) => {
    try {
      const response = await productsApi.getPaginatedProducts(page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec du chargement des produits');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec du chargement du produit');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.searchProducts(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Échec de la recherche');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Product By Id
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
