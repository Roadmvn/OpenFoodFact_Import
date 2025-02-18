import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ProductScreenProps } from '@types/navigation';
import { RootState } from '@store/types';
import { fetchProductsStart } from '@store/slices/productsSlice';
import ProductCard from '@components/products/ProductCard';

const ProductListScreen: React.FC<ProductScreenProps<'ProductList'>> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductsStart());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
  },
});

export default ProductListScreen;
