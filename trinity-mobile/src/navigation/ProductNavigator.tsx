import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductStackParamList } from './types';
import { NavigationGuard } from './NavigationGuard';

import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import AddProductScreen from '../screens/products/AddProductScreen';
import EditProductScreen from '../screens/products/EditProductScreen';

const Stack = createNativeStackNavigator<ProductStackParamList>();

export const ProductNavigator = () => {
  return (
    <NavigationGuard>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="ProductList" 
          component={ProductListScreen}
          options={{
            title: 'Produits'
          }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{
            title: 'Détails du produit'
          }}
        />
        <Stack.Screen 
          name="AddProduct" 
          component={AddProductScreen}
          options={{
            title: 'Ajouter un produit'
          }}
        />
        <Stack.Screen 
          name="EditProduct" 
          component={EditProductScreen}
          options={{
            title: 'Modifier le produit'
          }}
        />
      </Stack.Navigator>
    </NavigationGuard>
  );
};
