import React from 'react';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Product } from '@store/types';

interface ProductFormProps {
  initialValues: Partial<Product>;
  onSubmit: (values: Partial<Product>) => void;
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [values, setValues] = React.useState<Partial<Product>>(initialValues);

  const handleChange = (name: keyof Product) => (text: string) => {
    let value: string | number | null = text;
    
    // Convertir les valeurs nutritionnelles en nombres
    const numericFields: (keyof Product)[] = [
      'energy_kcal',
      'fat',
      'saturated_fat',
      'carbohydrates',
      'sugars',
      'fiber',
      'proteins',
      'salt',
      'sodium',
    ];

    if (numericFields.includes(name)) {
      value = text === '' ? null : Number(text);
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Informations de base */}
        <TextInput
          style={styles.input}
          placeholder="Nom du produit"
          value={values.name}
          onChangeText={handleChange('name')}
        />
        <TextInput
          style={styles.input}
          placeholder="Marque"
          value={values.brand}
          onChangeText={handleChange('brand')}
        />
        <TextInput
          style={styles.input}
          placeholder="Code-barres"
          value={values.code || ''}
          onChangeText={handleChange('code')}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Catégories (séparées par des virgules)"
          value={values.categories}
          onChangeText={handleChange('categories')}
        />
        <TextInput
          style={styles.input}
          placeholder="Labels (séparés par des virgules)"
          value={values.labels}
          onChangeText={handleChange('labels')}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantité (ex: 100g, 1L)"
          value={values.quantity || ''}
          onChangeText={handleChange('quantity')}
        />
        <TextInput
          style={styles.input}
          placeholder="URL de l'image"
          value={values.image_url || ''}
          onChangeText={handleChange('image_url')}
        />
        <TextInput
          style={styles.input}
          placeholder="URL de l'image nutritionnelle"
          value={values.image_nutrition_url || ''}
          onChangeText={handleChange('image_nutrition_url')}
        />

        {/* Valeurs nutritionnelles */}
        <View style={styles.nutritionSection}>
          <TextInput
            style={styles.nutritionInput}
            placeholder="Énergie (kcal)"
            value={values.energy_kcal?.toString() || ''}
            onChangeText={handleChange('energy_kcal')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Protéines (g)"
            value={values.proteins?.toString() || ''}
            onChangeText={handleChange('proteins')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Glucides (g)"
            value={values.carbohydrates?.toString() || ''}
            onChangeText={handleChange('carbohydrates')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Sucres (g)"
            value={values.sugars?.toString() || ''}
            onChangeText={handleChange('sugars')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Lipides (g)"
            value={values.fat?.toString() || ''}
            onChangeText={handleChange('fat')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Acides gras saturés (g)"
            value={values.saturated_fat?.toString() || ''}
            onChangeText={handleChange('saturated_fat')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Fibres (g)"
            value={values.fiber?.toString() || ''}
            onChangeText={handleChange('fiber')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Sel (g)"
            value={values.salt?.toString() || ''}
            onChangeText={handleChange('salt')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.nutritionInput}
            placeholder="Sodium (g)"
            value={values.sodium?.toString() || ''}
            onChangeText={handleChange('sodium')}
            keyboardType="numeric"
          />
        </View>
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
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  nutritionSection: {
    marginTop: 16,
  },
  nutritionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default ProductForm;
