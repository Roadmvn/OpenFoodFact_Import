import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import ProductListScreen from '../../screens/main/products/ProductListScreen';
import ProductDetailsScreen from '../../screens/main/product-details/ProductDetailsScreen';
import ProfileScreen from '../../screens/main/profile/ProfileScreen';
import ScannerScreen from '../../screens/main/scanner/ScannerScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Products" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Scanner" component={ScannerScreen} />
    </Stack.Navigator>
  );
}
