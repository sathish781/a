import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import SellBookScreen from '../screens/SellBookScreen';
import DonationScreen from '../screens/DonationScreen';
import ExchangeScreen from '../screens/ExchangeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import LibraryPanelScreen from '../screens/LibraryPanelScreen';
import ShopPanelScreen from '../screens/ShopPanelScreen';

import StudentDashboardScreen from '../screens/dashboards/StudentDashboardScreen';
import LibraryDashboardScreen from '../screens/dashboards/LibraryDashboardScreen';
import ShopDashboardScreen from '../screens/dashboards/ShopDashboardScreen';
import AdminRoleDashboardScreen from '../screens/dashboards/AdminRoleDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 19 }}>
      {icon}
    </Text>
  );
}

function MainTabs() {
  const { user } = useAuth();
  const { theme } = useThemeMode();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBg,
          borderTopColor:
            theme.mode === 'dark'
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(15,23,42,0.12)',
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🔎" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Market"
        component={MarketplaceScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🛒" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Donate"
        component={DonationScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎁" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" focused={focused} />,
        }}
      />

      {user?.role === 'admin' && (
        <Tab.Screen
          name="Admin"
          component={AdminDashboardScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon icon="🛡️" focused={focused} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loadingUser } = useAuth();
  const { theme } = useThemeMode();

  if (loadingUser) {
    return (
      <View style={[styles.loading, { backgroundColor: theme.backgroundOne }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundOne,
        },
        headerTintColor: theme.white,
        headerTitleStyle: {
          fontWeight: '900',
        },
      }}
    >
      {!user ? (
        <>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
          <Stack.Screen name="LibraryDashboard" component={LibraryDashboardScreen} />
          <Stack.Screen name="ShopDashboard" component={ShopDashboardScreen} />
          <Stack.Screen name="AdminRoleDashboard" component={AdminRoleDashboardScreen} />

          <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
          <Stack.Screen name="SellBook" component={SellBookScreen} />
          <Stack.Screen name="Exchange" component={ExchangeScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="LibraryPanel" component={LibraryPanelScreen} />
          <Stack.Screen name="ShopPanel" component={ShopPanelScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});