import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import { RootState } from '../../store/types';
import { AppDispatch } from '../../store';

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
  });

  const handleRegister = async () => {
    // Validation des champs requis
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'email
    if (!formData.email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Validation du mot de passe
    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Vérification de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await dispatch(registerUser(userData)).unwrap();
    } catch (error: any) {
      Alert.alert(
        'Erreur d\'inscription',
        error === 'L\'utilisateur existe déjà！' 
          ? 'Un compte existe déjà avec cet email'
          : 'Une erreur est survenue lors de l\'inscription'
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Créer un compte</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Prénom *"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          autoCapitalize="words"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Nom *"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          autoCapitalize="words"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe *"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe *"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Code postal"
          value={formData.zipCode}
          onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          placeholder="Pays"
          value={formData.country}
          onChangeText={(text) => setFormData({ ...formData, country: text })}
          placeholderTextColor="#666"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>
            Déjà un compte ? Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default RegisterScreen;
