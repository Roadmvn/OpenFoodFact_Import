import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store/types';
import { RootStackParamList } from './types';
import type { NavigationProp } from '@react-navigation/native';

interface NavigationGuardProps {
  children: React.ReactNode;
}

export const NavigationGuard: React.FC<NavigationGuardProps> = ({ children }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  }, [isAuthenticated, navigation]);

  return <>{children}</>;
};
