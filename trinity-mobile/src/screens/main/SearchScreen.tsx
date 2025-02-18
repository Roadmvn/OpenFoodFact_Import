import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MainTabScreenProps } from '@types/navigation';
import { RootState } from '@store/types';
import ProductCard from '@components/products/ProductCard';

const SearchScreen: React.FC<MainTabScreenProps<'Search'>> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state: RootState) => state.products);

  const handleSearch = () => {
    // TODO: Implement search logic
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('Product', {
                screen: 'ProductDetail',
                params: { product: item }
              })}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 10,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
  },
});

export default SearchScreen;
