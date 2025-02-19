import { Platform } from 'react-native';

// L'URL de base change selon la plateforme
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Pour l'émulateur Android
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    // Pour l'émulateur iOS
    return 'http://localhost:3000/api';
  } else {
    // Pour le web ou autre
    return 'http://localhost:3000/api';
  }
};

export const API_URL = getBaseUrl();
