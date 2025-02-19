import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthStack from './stacks/AuthStack';
import MainStack from './stacks/MainStack';
import SplashScreen from '../screens/auth/SplashScreen';
import { restoreSessionRequest } from '../store/slices/authSlice';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { token, loading, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(restoreSessionRequest());
  }, []);

  // Afficher le SplashScreen pendant l'initialisation
  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="Main" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
