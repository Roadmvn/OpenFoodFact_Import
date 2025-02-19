import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Products: undefined;
  ProductDetails: { id: number };
  Profile: undefined;
  Scanner: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> = 
  NativeStackScreenProps<MainStackParamList, T>;

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
