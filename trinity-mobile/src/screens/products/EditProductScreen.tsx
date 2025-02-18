import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateProduct } from '../../store/slices/productsSlice';
import { RootState } from '../../store/types';

export const EditProductScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { productId } = route.params;
  const product = useSelector((state: RootState) => 
    state.products.items.find(p => p.id === productId)
  );

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setBrand(product.brand);
      setDescription(product.description || '');
      setBarcode(product.barcode || '');
      setPrice(product.price.toString());
    }
  }, [product]);

  const handleSubmit = async () => {
    try {
      await dispatch(updateProduct({
        id: productId,
        name,
        brand,
        description,
        barcode,
        price: parseFloat(price),
      })).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Produit non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom du produit"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Marque"
          value={brand}
          onChangeText={setBrand}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Code-barres"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Prix"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Mettre à jour le produit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProductScreen;
