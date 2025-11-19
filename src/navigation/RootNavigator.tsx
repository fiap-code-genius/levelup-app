import React from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
  Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useTheme, useThemeColors } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminTasksScreen from '../screens/AdminTasksScreen';
import AdminRewardsScreen from '../screens/AdminRewardsScreen';
import AdminProfileScreen from '../screens/AdminProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 30,
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tarefas') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Prêmios') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tarefas" component={TasksScreen} />
      <Tab.Screen name="Prêmios" component={RewardsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AdminTabs() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 30,
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Usuários') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'TarefasAdmin') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'PrêmiosAdmin') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'PerfilAdmin') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Usuários" component={AdminUsersScreen} />
      <Tab.Screen
        name="TarefasAdmin"
        component={AdminTasksScreen}
        options={{ title: 'Tarefas' }}
      />
      <Tab.Screen
        name="PrêmiosAdmin"
        component={AdminRewardsScreen}
        options={{ title: 'Prêmios' }}
      />
      <Tab.Screen
        name="PerfilAdmin"
        component={AdminProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export const RootNavigator = () => {
  const { currentUser, loading } = useAuth();
  const { mode, theme } = useTheme();

  if (loading) return null;

  const isAdmin = currentUser?.role === 'ADMIN';

  const navTheme: NavTheme =
    mode === 'dark'
      ? {
          ...NavDarkTheme,
          colors: {
            ...NavDarkTheme.colors,
            background: theme.colors.background,
            card: theme.colors.card,
            text: theme.colors.text,
            border: theme.colors.border,
            primary: theme.colors.primary,
          },
        }
      : {
          ...NavDefaultTheme,
          colors: {
            ...NavDefaultTheme.colors,
            background: theme.colors.background,
            card: theme.colors.card,
            text: theme.colors.text,
            border: theme.colors.border,
            primary: theme.colors.primary,
          },
        };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : isAdmin ? (
          <Stack.Screen name="AdminTabs" component={AdminTabs} />
        ) : (
          <Stack.Screen name="UserTabs" component={UserTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
