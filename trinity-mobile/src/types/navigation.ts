import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Product } from '@store/types';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Scan: undefined;
  Profile: undefined;
};

// Product Stack
export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { product: Product };
  AddProduct: undefined;
  EditProduct: { productId: number };
};

// Root Stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Product: NavigatorScreenParams<ProductStackParamList>;
};

// Navigation Props
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type ProductScreenProps<T extends keyof ProductStackParamList> = NativeStackScreenProps<
  ProductStackParamList,
  T
>;
