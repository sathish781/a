import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';

import { useThemeMode } from '../../context/ThemeContext';

function ShopCard({ icon, title, text, button, onPress }) {
  const { theme } = useThemeMode();
  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#090a14', borderColor: theme.primary }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Text style={[styles.cardText, { color: theme.muted }]}>{text}</Text>
      <AppButton title={button} onPress={onPress} style={{ marginTop: 8 }} />
    </GlassCard>
  );
}

export default function ShopDashboardScreen({ navigation }) {
  const { theme } = useThemeMode();

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.greet, { color: theme.primary }]}>SHOP OWNER PANEL</Text>
          <Text style={[styles.title, { color: theme.text }]}>Bookstore Dashboard</Text>
        </View>

        <ShopCard
          icon="➕"
          title="Add New Book"
          text="Add new book titles, prices, conditions, and stock counts to your shop."
          button="ADD BOOK TO INVENTORY"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="📦"
          title="Manage Inventory & Stock"
          text="View, update, or delete listed books in your shop catalog."
          button="MANAGE INVENTORY"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="🛒"
          title="Customer Orders"
          text="Track and fulfill student orders, verify delivery and payments."
          button="VIEW ORDERS"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="💬"
          title="Customer Requests"
          text="Check book availability inquiries sent by students."
          button="CUSTOMER REQUESTS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <ShopCard
          icon="📊"
          title="Sales Report"
          text="View monthly shop sales analytics, popular titles, and revenue."
          button="SALES REPORT"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="🔔"
          title="Notifications"
          text="Receive notifications for new order placement and approval status."
          button="NOTIFICATIONS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <ShopCard
          icon="👤"
          title="Shop Profile Settings"
          text="Update your shop name, business address, and contact number."
          button="EDIT PROFILE"
          onPress={() => navigation.navigate('Profile')}
        />
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 16,
  },
  greet: {
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  card: {
    padding: 18,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  cardText: {
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 20,
    fontSize: 13,
    fontWeight: '500',
  },
});