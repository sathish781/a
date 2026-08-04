import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import AppScrollView from '../components/AppScrollView';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { radius } from '../utils/theme';

import { useThemeMode } from '../context/ThemeContext';

function FeatureCard({ icon, title, text, onPress }) {
  const { theme } = useThemeMode();
  return (
    <GlassCard style={styles.gridCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#090a14', borderColor: theme.glassBorder }]}>
          <Text style={styles.gridCardIcon}>{icon}</Text>
        </View>
      </View>

      <Text style={[styles.gridCardTitle, { color: theme.text }]} numberOfLines={2}>
        {title}
      </Text>

      <Text style={[styles.gridCardText, { color: theme.muted }]} numberOfLines={3}>
        {text}
      </Text>

      <AppButton title="OPEN" onPress={onPress} />
    </GlassCard>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useThemeMode();

  function openDashboard() {
    if (user?.role === 'student') {
      navigation.navigate('StudentDashboard');
    } else if (user?.role === 'library' || user?.role === 'library_staff') {
      navigation.navigate('LibraryDashboard');
    } else if (user?.role === 'shop' || user?.role === 'shop_owner') {
      navigation.navigate('ShopDashboard');
    } else if (user?.role === 'admin') {
      navigation.navigate('AdminRoleDashboard');
    } else {
      navigation.navigate('StudentDashboard');
    }
  }

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <AppHeader
          icon="📚"
          label={`Welcome, ${user?.name || user?.shopName || user?.libraryName || 'User'}`}
          title="BookConnect"
          subtitle="Find books from library, local shops, and student marketplace."
        />

        {/* Hero Banner */}
        <GlassCard style={styles.hero}>
          <View style={[styles.heroBadgeCircle, { backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#090a14', borderColor: theme.primary }]}>
            <Text style={styles.heroIcon}>📘</Text>
          </View>

          <Text style={[styles.heroTitle, { color: theme.text }]}>
            One Search, Three Sources
          </Text>

          <Text style={[styles.heroText, { color: theme.muted }]}>
            Borrow from library, buy from local shop, or exchange with students directly.
          </Text>

          <View style={styles.badgeRow}>
            <View style={[styles.redBadge, { borderColor: theme.primary, backgroundColor: theme.mode === 'light' ? 'rgba(220, 38, 38, 0.08)' : 'rgba(255, 0, 60, 0.15)' }]}>
              <Text style={[styles.redBadgeText, { color: theme.primary }]}>Role: {user?.role || 'student'}</Text>
            </View>

            <View style={[styles.redBadge, { borderColor: theme.primary, backgroundColor: theme.mode === 'light' ? 'rgba(220, 38, 38, 0.08)' : 'rgba(255, 0, 60, 0.15)' }]}>
              <Text style={[styles.redBadgeText, { color: theme.primary }]}>Mode: {theme.mode === 'light' ? 'White Light' : 'Dark Mode'}</Text>
            </View>
          </View>

          <AppButton
            title="OPEN MY DASHBOARD →"
            onPress={openDashboard}
            style={{ width: '100%', marginTop: 8 }}
          />
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Features</Text>

        <View style={styles.gridContainer}>
          <FeatureCard
            icon="🔎"
            title="Smart Search"
            text="Find books by name, author, or subject instantly."
            onPress={() => navigation.navigate('Search')}
          />

          <FeatureCard
            icon="📸"
            title="Sell Books"
            text="Take a photo, set a price, and post your listing."
            onPress={() => navigation.navigate('SellBook')}
          />

          <FeatureCard
            icon="💰"
            title="Compare Prices"
            text="Check library vs student vs shop prices easily."
            onPress={() => navigation.navigate('Search')}
          />

          <FeatureCard
            icon="🔁"
            title="Book Exchange"
            text="Swap books directly with other campus students."
            onPress={() => navigation.navigate('Exchange')}
          />

          <FeatureCard
            icon="🎁"
            title="Donate Books"
            text="Give away books or request book donations."
            onPress={() => navigation.navigate('Donate')}
          />

          <FeatureCard
            icon="🔔"
            title="Alerts & Updates"
            text="Track your reservations and request updates."
            onPress={() => navigation.navigate('Notifications')}
          />
        </View>
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 28,
    marginTop: 8,
    marginBottom: 24,
  },
  heroBadgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#dc2626',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  heroIcon: {
    fontSize: 38,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroText: {
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 8,
  },
  redBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  redBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 14,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    padding: 14,
    marginVertical: 6,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCardIcon: {
    fontSize: 26,
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  gridCardText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
    flex: 1,
  },
});