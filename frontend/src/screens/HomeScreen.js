import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import AppScrollView from '../components/AppScrollView';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

function FeatureCard({ icon, title, text, button, onPress }) {
  const { theme } = useThemeMode();

  return (
    <GlassCard>
      <Text style={styles.cardIcon}>{icon}</Text>

      <Text style={[styles.cardTitle, { color: theme.white }]}>
        {title}
      </Text>

      <Text style={[styles.cardText, { color: theme.muted }]}>
        {text}
      </Text>

      <AppButton title={button} onPress={onPress} />
    </GlassCard>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, themeMode } = useThemeMode();

  function openDashboard() {
    if (user?.role === 'student') {
      navigation.navigate('StudentDashboard');
    } else if (user?.role === 'library_staff') {
      navigation.navigate('LibraryDashboard');
    } else if (user?.role === 'shop_owner') {
      navigation.navigate('ShopDashboard');
    } else if (user?.role === 'admin') {
      navigation.navigate('AdminRoleDashboard');
    }
  }

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <AppHeader
          icon="📚"
          label={`Welcome, ${user?.name}`}
          title="BookConnect"
          subtitle="Find books from library, local shops, and student marketplace."
        />

        <GlassCard style={styles.hero}>
          <Text style={styles.heroIcon}>📘</Text>

          <Text style={[styles.heroTitle, { color: theme.white }]}>
            One Search, Three Sources
          </Text>

          <Text style={[styles.heroText, { color: theme.muted }]}>
            Borrow from library, buy from local shop, or exchange with students.
          </Text>

          <View style={styles.badgeRow}>
            <Text style={[styles.badge, { color: theme.white }]}>
              {user?.role}
            </Text>

            <Text style={[styles.badge, { color: theme.white }]}>
              {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>

          <AppButton title="Open My Dashboard" onPress={openDashboard} />
        </GlassCard>

        <FeatureCard
          icon="🔎"
          title="Smart Search"
          text="Search by book name, author, ISBN, course, subject, semester, or exam."
          button="Search Books"
          onPress={() => navigation.navigate('Search')}
        />

        <FeatureCard
          icon="📸"
          title="Sell Book With Photo"
          text="Take book photo, set price, condition, and upload to marketplace."
          button="Upload Book"
          onPress={() => navigation.navigate('SellBook')}
        />

        <FeatureCard
          icon="💰"
          title="Price Comparison"
          text="Compare student seller price, local shop price, and library availability."
          button="Compare Now"
          onPress={() => navigation.navigate('Search')}
        />

        <FeatureCard
          icon="🔁"
          title="Book Exchange"
          text="Send exchange request and wait for the other student to accept."
          button="Exchange Requests"
          onPress={() => navigation.navigate('Exchange')}
        />

        <FeatureCard
          icon="🎁"
          title="Book Donation"
          text="Donate books to juniors or request donated books from others."
          button="Open Donation"
          onPress={() => navigation.navigate('Donate')}
        />

        <FeatureCard
          icon="🔔"
          title="Smart Notifications"
          text="Track reservation, donation, exchange, and availability updates."
          button="View Alerts"
          onPress={() => navigation.navigate('Notifications')}
        />
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  heroIcon: {
    fontSize: 62,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroText: {
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
  cardIcon: {
    fontSize: 38,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  cardText: {
    marginTop: 6,
    marginBottom: 8,
    lineHeight: 21,
    fontWeight: '600',
  },
});