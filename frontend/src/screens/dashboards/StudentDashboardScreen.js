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
    <GlassCard>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.cardTitle, { color: theme.white }]}>{title}</Text>
      <Text style={[styles.cardText, { color: theme.muted }]}>{text}</Text>
      <AppButton title={button} onPress={onPress} />
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
          title={`Hi, ${user?.name}`}
          subtitle="Search, sell, exchange, donate, and reserve books."
        />

        <GlassCard style={styles.profileCard}>
          <Text style={styles.profileIcon}>🎓</Text>

          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: theme.white }]}>
              {user?.name}
            </Text>

            <Text style={[styles.profileText, { color: theme.muted }]}>
              {user?.college || 'College not added'}
            </Text>

            <Text style={[styles.profileText, { color: theme.muted }]}>
              Donation Badges: {user?.badgeCount || 0}
            </Text>
          </View>
        </GlassCard>

        <ActionCard
          icon="🔎"
          title="Find Books"
          text="Search from library, local shop, and student marketplace."
          button="Search Books"
          onPress={() => navigation.navigate('Search')}
        />

        <ActionCard
          icon="📸"
          title="Sell Book With Photo"
          text="Take book photo, mention amount, condition, and upload."
          button="Sell My Book"
          onPress={() => navigation.navigate('SellBook')}
        />

        <ActionCard
          icon="🔁"
          title="Exchange Book"
          text="Send exchange request to another student and wait for acceptance."
          button="Exchange Requests"
          onPress={() => navigation.navigate('Exchange')}
        />

        <ActionCard
          icon="🎁"
          title="Donate Book"
          text="Donate old books to junior or needy students."
          button="Donate / Request"
          onPress={() => navigation.navigate('Donate')}
        />

        <ActionCard
          icon="📌"
          title="Reserve Library Book"
          text="Reserve available library books before visiting."
          button="Find Library Books"
          onPress={() => navigation.navigate('Search')}
        />
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 48,
    marginRight: 14,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
  },
  profileText: {
    marginTop: 4,
    fontWeight: '700',
  },
  icon: {
    fontSize: 38,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  cardText: {
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 21,
    fontWeight: '600',
  },
});