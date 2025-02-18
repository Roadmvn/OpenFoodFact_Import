import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addProduct } from '@store/slices/productsSlice';
import { ProductScreenProps } from '@types/navigation';
import ProductForm from '@components/products/ProductForm';
import { Product } from '@store/types';

const AddProductScreen: React.FC<ProductScreenProps<'AddProduct'>> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const initialValues: Partial<Product> = {
    name: '',
    brand: '',
    code: null,
    categories: '',
    labels: '',
    quantity: null,
    image_url: null,
    image_nutrition_url: null,
    energy_kcal: null,
    fat: null,
    saturated_fat: null,
    carbohydrates: null,
    sugars: null,
    fiber: null,
    proteins: null,
    salt: null,
    sodium: null,
  };

  const handleSubmit = async (values: Partial<Product>) => {
    try {
      setIsSubmitting(true);
      await dispatch(addProduct(values));
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => handleSubmit(initialValues)}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Ajouter le produit
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default AddProductScreen;
