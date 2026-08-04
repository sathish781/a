import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

import SplashScreen from '../screens/SplashScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
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
    <View style={tabStyles.iconContainer}>
      <Text style={{ fontSize: focused ? 22 : 19, opacity: focused ? 1 : 0.7 }}>
        {icon}
      </Text>
      {focused && <View style={tabStyles.activeDot} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6366f1',
    marginTop: 3,
    shadowColor: '#acd8f4ff',
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
});

function MainTabs() {
  const { user } = useAuth();
  const { theme } = useThemeMode();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBg || theme.backgroundOne,
          borderTopColor: theme.glassBorder,
          borderTopWidth: 1,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 8,
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
          letterSpacing: 0.4,
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
        headerTintColor: theme.text,
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
          <Stack.Screen
            name="RoleSelection"
            component={RoleSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
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