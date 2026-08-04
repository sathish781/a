import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import AppScrollView from '../../components/AppScrollView';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';

import { useThemeMode } from '../../context/ThemeContext';

function ActionCard({ icon, title, text, button, onPress }) {
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

export default function StudentDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useThemeMode();

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <AppHeader
          icon="🎓"
          label="Student Dashboard"
          title={`Hi, ${user?.name || 'Student'}`}
          subtitle="Manage your book searches, sales, swaps, donations, and reservations."
        />

        <ActionCard
          icon="🏠"
          title="Home"
          text="Return to main home page to explore categories and featured books."
          button="GO TO HOME"
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        />

        <ActionCard
          icon="🔎"
          title="Search Books"
          text="Find books from library, local shop, and student marketplace."
          button="SEARCH BOOKS"
          onPress={() => navigation.navigate('Search')}
        />

        <ActionCard
          icon="🛒"
          title="Buy Books"
          text="Buy used or new books from local shops or other students."
          button="EXPLORE MARKETPLACE"
          onPress={() => navigation.navigate('Market')}
        />

        <ActionCard
          icon="📸"
          title="Sell Books"
          text="Upload a photo of your book, set condition, and sell it."
          button="POST BOOK FOR SALE"
          onPress={() => navigation.navigate('SellBook')}
        />

        <ActionCard
          icon="🔁"
          title="Exchange Books & My Exchanges"
          text="Swap books directly with other students on campus."
          button="EXCHANGE HUB"
          onPress={() => navigation.navigate('Exchange')}
        />

        <ActionCard
          icon="🎁"
          title="Donate Books & My Donations"
          text="Donate old books to juniors or view your past donations."
          button="DONATION HUB"
          onPress={() => navigation.navigate('Donate')}
        />

        <ActionCard
          icon="📋"
          title="Book Reservations"
          text="View your reserved library books and borrow status."
          button="MY RESERVATIONS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <ActionCard
          icon="🔔"
          title="Notifications"
          text="Check updates on your reservations, purchases, and requests."
          button="VIEW NOTIFICATIONS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <ActionCard
          icon="👤"
          title="My Profile"
          text="Update your details, college info, and preferences."
          button="GO TO PROFILE"
          onPress={() => navigation.navigate('Profile')}
        />
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 110,
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