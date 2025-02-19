import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  fetchProfileRequest,
  updateProfileRequest,
} from '../../../store/slices/authSlice';
import Header from '../../../components/common/Header';
import { UpdateProfileData } from '../../../store/types/auth';
import { useToast } from '../../../contexts/ToastContext';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user, loading, isUpdating, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
  });

  // Refs pour la navigation entre les champs
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const zipCodeRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        zipCode: user.zipCode || '',
        city: user.city || '',
        country: user.country || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error, showToast]);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return false;
    }

    if (!formData.email.includes('@')) {
      showToast('Email invalide', 'error');
      return false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      showToast('Numéro de téléphone invalide', 'error');
      return false;
    }

    if (formData.zipCode && !/^\d{5}$/.test(formData.zipCode)) {
      showToast('Code postal invalide', 'error');
      return false;
    }

    return true;
  };

  const handleUpdateProfile = () => {
    if (!validateForm()) return;

    Alert.alert(
      'Confirmation',
      'Voulez-vous mettre à jour votre profil ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Mettre à jour',
          onPress: () => {
            dispatch(updateProfileRequest(formData));
            showToast('Profil mis à jour avec succès', 'success');
          }
        }
      ]
    );
  };

  if (loading && !user) {
    return (
      <View style={styles.container}>
        <Header title="Profil" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Profil" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <Text style={styles.title}>Informations personnelles</Text>

            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              placeholder="Prénom"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
            />

            <Text style={styles.label}>Nom *</Text>
            <TextInput
              ref={lastNameRef}
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              placeholder="Nom"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
            />

            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              ref={phoneRef}
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Téléphone"
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
            />

            <Text style={styles.label}>Adresse</Text>
            <TextInput
              ref={addressRef}
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Adresse"
              returnKeyType="next"
              onSubmitEditing={() => zipCodeRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
            />

            <Text style={styles.label}>Code postal</Text>
            <TextInput
              ref={zipCodeRef}
              style={styles.input}
              value={formData.zipCode}
              onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
              placeholder="Code postal"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
              maxLength={5}
            />

            <Text style={styles.label}>Ville</Text>
            <TextInput
              ref={cityRef}
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Ville"
              returnKeyType="next"
              onSubmitEditing={() => countryRef.current?.focus()}
              blurOnSubmit={false}
              editable={!isUpdating}
            />

            <Text style={styles.label}>Pays</Text>
            <TextInput
              ref={countryRef}
              style={styles.input}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="Pays"
              returnKeyType="done"
              onSubmitEditing={handleUpdateProfile}
              editable={!isUpdating}
            />

            <TouchableOpacity
              style={[styles.button, isUpdating && styles.buttonDisabled]}
              onPress={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Mettre à jour</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

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
  content: {
    flex: 1,
  },
  form: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
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
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
