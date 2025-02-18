import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductStackParamList } from '@types/navigation';

// Import screens
import ProductListScreen from '@screens/products/ProductListScreen';
import ProductDetailScreen from '@screens/products/ProductDetailScreen';

const Stack = createNativeStackNavigator<ProductStackParamList>();

export const ProductNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{
          title: 'Produits',
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          title: 'Détails du produit',
        }}
      />
    </Stack.Navigator>
  );
};
