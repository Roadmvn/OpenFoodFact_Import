import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { AuthStackScreenProps } from '../../navigation/types/navigation';

type Props = AuthStackScreenProps<'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trinity</Text>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  loader: {
    marginTop: 20,
  },
});
