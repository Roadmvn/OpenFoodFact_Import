import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '@store/types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.noImageContainer]}>
          <MaterialCommunityIcons name="food-off" size={32} color="#666" />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        {product.brand && (
          <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        )}
        {product.energy_kcal && (
          <Text style={styles.nutrition}>{product.energy_kcal} kcal</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 8,
    flex: 1,
    maxWidth: '45%',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  brand: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutrition: {
    fontSize: 12,
    color: '#2196F3',
  },
});

export default ProductCard;
