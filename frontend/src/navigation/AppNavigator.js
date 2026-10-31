import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Animated } from 'react-native';

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
import InitiateExchangeScreen from '../screens/InitiateExchangeScreen';
import OfferExchangeBookScreen from '../screens/OfferExchangeBookScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import LibraryPanelScreen from '../screens/LibraryPanelScreen';
import ShopPanelScreen from '../screens/ShopPanelScreen';

import LibraryInventoryScreen from '../screens/dashboards/LibraryInventoryScreen';
import LibraryHistoryScreen from '../screens/dashboards/LibraryHistoryScreen';
import StudentDashboardScreen from '../screens/dashboards/StudentDashboardScreen';
import LibraryDashboardScreen from '../screens/dashboards/LibraryDashboardScreen';
import ShopDashboardScreen from '../screens/dashboards/ShopDashboardScreen';
import ShopInventoryScreen from '../screens/dashboards/ShopInventoryScreen';
import ShopOrdersScreen from '../screens/dashboards/ShopOrdersScreen';
import ShopSalesReportScreen from '../screens/dashboards/ShopSalesReportScreen';
import AdminRoleDashboardScreen from '../screens/dashboards/AdminRoleDashboardScreen';
import AdminBookCatalogScreen from '../screens/dashboards/AdminBookCatalogScreen';
import AdminMarketplaceScreen from '../screens/dashboards/AdminMarketplaceScreen';
import ManageLibraryRequestsScreen from '../screens/dashboards/ManageLibraryRequestsScreen';
import ManageShopRequestsScreen from '../screens/dashboards/ManageShopRequestsScreen';
import BorrowHistoryScreen from '../screens/dashboards/BorrowHistoryScreen';
import PurchaseHistoryScreen from '../screens/dashboards/PurchaseHistoryScreen';
import UserManagementScreen from '../screens/UserManagementScreen';
import OrganizationApprovalScreen from '../screens/OrganizationApprovalScreen';
import ShopRequestScreen from '../screens/ShopRequestScreen';
import LibraryRequestScreen from '../screens/LibraryRequestScreen';
import ShopsDirectoryScreen from '../screens/ShopsDirectoryScreen';
import LibrariesDirectoryScreen from '../screens/LibrariesDirectoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AnimatedTabIcon({ icon, focused }) {
  const { theme } = useThemeMode();
  const scaleAnim = useRef(new Animated.Value(focused ? 1.18 : 1)).current;
  const translateAnim = useRef(new Animated.Value(focused ? -3 : 0)).current;
  const dotWidth = useRef(new Animated.Value(focused ? 16 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1,
        tension: 65,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(translateAnim, {
        toValue: focused ? -3 : 0,
        tension: 65,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(dotWidth, {
        toValue: focused ? 16 : 0,
        tension: 65,
        friction: 6,
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={tabStyles.iconContainer}>
      <Animated.Text
        style={[
          tabStyles.iconText,
          {
            opacity: focused ? 1 : 0.65,
            transform: [{ scale: scaleAnim }, { translateY: translateAnim }],
          },
        ]}
      >
        {icon}
      </Animated.Text>
      <Animated.View
        style={[
          tabStyles.activePill,
          {
            width: dotWidth,
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
        ]}
      />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  activePill: {
    height: 3.5,
    borderRadius: 2,
    marginTop: 4,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
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
          elevation: 10,
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="🏠" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="🔎" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Market"
        component={MarketplaceScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="🛒" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Donate"
        component={DonationScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="🎁" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Messages"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="💬" focused={focused} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="👤" focused={focused} />,
        }}
      />

      {user?.role === 'admin' && (
        <Tab.Screen
          name="Admin"
          component={AdminDashboardScreen}
          options={{
            tabBarIcon: ({ focused }) => <AnimatedTabIcon icon="🛡️" focused={focused} />,
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
        contentStyle: {
          flex: 1,
          height: '100%',
          backgroundColor: theme.backgroundOne,
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
          <Stack.Screen name="ShopInventory" component={ShopInventoryScreen} />
          <Stack.Screen name="ShopOrders" component={ShopOrdersScreen} />
          <Stack.Screen name="ShopSalesReport" component={ShopSalesReportScreen} />
          <Stack.Screen name="AdminRoleDashboard" component={AdminRoleDashboardScreen} />
          <Stack.Screen name="AdminBookCatalog" component={AdminBookCatalogScreen} options={{ title: 'Book Catalog' }} />
          <Stack.Screen name="AdminMarketplace" component={AdminMarketplaceScreen} options={{ title: 'Marketplace Mgt' }} />
          <Stack.Screen name="ManageLibraryRequests" component={ManageLibraryRequestsScreen} />
          <Stack.Screen name="ManageShopRequests" component={ManageShopRequestsScreen} />
          <Stack.Screen name="BorrowHistory" component={BorrowHistoryScreen} />
          <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
          <Stack.Screen name="UserManagement" component={UserManagementScreen} />
          <Stack.Screen name="OrganizationApproval" component={OrganizationApprovalScreen} />

          <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
          <Stack.Screen name="SellBook" component={SellBookScreen} />
          <Stack.Screen name="Exchange" component={ExchangeScreen} />
          <Stack.Screen name="InitiateExchange" component={InitiateExchangeScreen} options={{ title: 'Swap Books' }} />
          <Stack.Screen name="OfferExchangeBook" component={OfferExchangeBookScreen} options={{ title: 'Offer Book' }} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="LibraryPanel" component={LibraryPanelScreen} options={{ title: 'Add New Book' }} />
          <Stack.Screen name="LibraryInventory" component={LibraryInventoryScreen} options={{ title: 'Catalog Manager' }} />
          <Stack.Screen name="LibraryHistory" component={LibraryHistoryScreen} options={{ title: 'Borrow History' }} />
          <Stack.Screen name="ShopPanel" component={ShopPanelScreen} />
          <Stack.Screen name="ShopsDirectory" component={ShopsDirectoryScreen} options={{ title: 'Local Book Shops' }} />
          <Stack.Screen name="LibrariesDirectory" component={LibrariesDirectoryScreen} options={{ title: 'College Libraries' }} />
          <Stack.Screen name="ShopRequest" component={ShopRequestScreen} options={{ title: 'Shop Request' }} />
          <Stack.Screen name="LibraryRequest" component={LibraryRequestScreen} options={{ title: 'Library Request' }} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ headerShown: false }} />
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
