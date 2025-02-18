import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { updateProduct } from '@store/slices/productsSlice';
import { ProductScreenProps } from '@types/navigation';
import ProductForm from '@components/products/ProductForm';
import { Product } from '@store/types';

const EditProductScreen: React.FC<ProductScreenProps<'EditProduct'>> = ({ 
  route,
  navigation 
}) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: Partial<Product>) => {
    try {
      setIsSubmitting(true);
      await dispatch(updateProduct({ id: product.id, ...values }));
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => handleSubmit(product)}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Modifier le produit
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

export default EditProductScreen;
