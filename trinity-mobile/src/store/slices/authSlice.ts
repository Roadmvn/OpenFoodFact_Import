import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginCredentials, LoginResponse, RegisterCredentials, User, UpdateProfileData } from '../types/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
  isUpdating: false,
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
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions d'inscription
    registerRequest: (state, action: PayloadAction<RegisterCredentials>) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Actions de déconnexion
    logoutRequest: (state) => {
      state.loading = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    // Actions de restauration de session
    restoreSessionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    restoreSessionSuccess: (state, action: PayloadAction<LoginResponse | null>) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || null;
      state.isInitialized = true;
    },
    restoreSessionFailure: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.isInitialized = true;
    },

    // Profile actions
    fetchProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateProfileRequest: (state, action: PayloadAction<UpdateProfileData>) => {
      state.isUpdating = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action: PayloadAction<User>) => {
      state.isUpdating = false;
      state.user = action.payload;
      state.error = null;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.isUpdating = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
} = authSlice.actions;

export default authSlice.reducer;
