import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, User } from '../types/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false, // Nouvel état pour suivre l'initialisation
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Actions de connexion
    loginRequest: (state, action: PayloadAction<LoginCredentials>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions de déconnexion
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.token = null;
      state.user = null;
    },

    // Actions de restauration de session
    restoreSessionRequest: (state) => {
      state.loading = true;
      state.isInitialized = false;
    },
    restoreSessionSuccess: (state, action: PayloadAction<{ token: string; user: User } | null>) => {
      state.loading = false;
      state.isInitialized = true;
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
      }
    },
    restoreSessionFailure: (state) => {
      state.loading = false;
      state.isInitialized = true;
      state.token = null;
      state.user = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
} = authSlice.actions;

export default authSlice.reducer;
