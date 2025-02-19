import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerRequest } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { useToast } from '../../contexts/ToastContext';
import { RegisterCredentials } from '../../store/types/auth';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { showToast } = useToast();

  const handleRegister = () => {
    // Validation basique
    if (Object.values(formData).some(value => !value)) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (!formData.email.includes('@')) {
      showToast('Email invalide', 'error');
      return;
    }

    dispatch(registerRequest(formData));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Inscription</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={formData.firstName}
          onChangeText={(text) => setFormData({...formData, firstName: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={formData.lastName}
          onChangeText={(text) => setFormData({...formData, lastName: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({...formData, phone: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={formData.address}
          onChangeText={(text) => setFormData({...formData, address: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Code postal"
          keyboardType="numeric"
          value={formData.zipCode}
          onChangeText={(text) => setFormData({...formData, zipCode: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={formData.city}
          onChangeText={(text) => setFormData({...formData, city: text})}
        />
        <TextInput
          style={styles.input}
          placeholder="Pays"
          value={formData.country}
          onChangeText={(text) => setFormData({...formData, country: text})}
        />

        <TouchableOpacity 
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>S'inscrire</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Déjà inscrit ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
  },
});
