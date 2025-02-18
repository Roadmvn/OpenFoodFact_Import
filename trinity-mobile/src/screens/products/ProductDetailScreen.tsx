import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProductScreenProps } from '@types/navigation';

const ProductDetailScreen: React.FC<ProductScreenProps<'ProductDetail'>> = ({ route }) => {
  const { product } = route.params;

  const nutritionItems = [
    { label: 'Énergie', value: product.energy_kcal, unit: 'kcal' },
    { label: 'Protéines', value: product.proteins, unit: 'g' },
    { label: 'Glucides', value: product.carbohydrates, unit: 'g' },
    { label: 'dont Sucres', value: product.sugars, unit: 'g' },
    { label: 'Lipides', value: product.fat, unit: 'g' },
    { label: 'dont Saturés', value: product.saturated_fat, unit: 'g' },
    { label: 'Fibres', value: product.fiber, unit: 'g' },
    { label: 'Sel', value: product.salt, unit: 'g' },
    { label: 'Sodium', value: product.sodium, unit: 'g' },
  ];

  return (
    <ScrollView style={styles.container}>
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.noImageContainer]}>
          <MaterialCommunityIcons name="food-off" size={64} color="#666" />
          <Text style={styles.noImageText}>Image non disponible</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        
        {product.categories && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catégories</Text>
            <View style={styles.categoryContainer}>
              {product.categories.split(',').map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {product.labels && product.labels !== 'None' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Labels</Text>
            <View style={styles.categoryContainer}>
              {product.labels.split(',').map((label, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{label.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {product.quantity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantité</Text>
            <Text style={styles.text}>{product.quantity}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations nutritionnelles</Text>
          <View style={styles.nutritionGrid}>
            {nutritionItems.map((item, index) => (
              item.value != null && (
                <View key={index} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>
                    {item.value} {item.unit}
                  </Text>
                  <Text style={styles.nutritionLabel}>{item.label}</Text>
                </View>
              )
            ))}
          </View>
        </View>

        {product.image_nutrition_url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tableau nutritionnel</Text>
            <Image
              source={{ uri: product.image_nutrition_url }}
              style={styles.nutritionImage}
            />
          </View>
        )}

        {product.code && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Code-barres</Text>
            <Text style={styles.text}>{product.code}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  nutritionImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
    marginTop: 8,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brand: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#444',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: '#2196F3',
    fontSize: 14,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ProductDetailScreen;
