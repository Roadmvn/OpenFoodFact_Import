import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import ScanScreen from '../screens/main/ScanScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { NavigationGuard } from './NavigationGuard';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <NavigationGuard>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;
            
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Search':
                iconName = focused ? 'search' : 'search-outline';
                break;
              case 'Scan':
                iconName = focused ? 'scan' : 'scan-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Accueil'
          }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            title: 'Rechercher'
          }}
        />
        <Tab.Screen 
          name="Scan" 
          component={ScanScreen}
          options={{
            title: 'Scanner'
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            title: 'Profil'
          }}
        />
      </Tab.Navigator>
    </NavigationGuard>
  );
};
