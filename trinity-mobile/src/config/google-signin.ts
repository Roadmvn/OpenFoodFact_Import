import { GoogleSignin, User, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID } from '@env';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    ...(Platform.OS === 'ios' ? { iosClientId: GOOGLE_IOS_CLIENT_ID } : {}),
    ...(Platform.OS === 'android' ? { androidClientId: GOOGLE_ANDROID_CLIENT_ID } : {}),
    offlineAccess: true,
  });
};

export const signInWithGoogle = async (): Promise<string | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // L'utilisateur a annulé la connexion
      return null;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('La connexion est déjà en cours');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services n\'est pas disponible');
    } else {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }
};
