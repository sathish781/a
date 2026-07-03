import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import { colors } from '../../utils/theme';

function AdminCard({ icon, title, text, button, onPress }) {
  return (
    <GlassCard>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <AppButton title={button} onPress={onPress} />
    </GlassCard>
  );
}

export default function AdminRoleDashboardScreen({ navigation }) {
  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greet}>Admin Panel</Text>
        <Text style={styles.title}>Full System Control</Text>

        <AdminCard
          icon="📊"
          title="Reports"
          text="View total users, books, libraries, shops, donations, and exchanges."
          button="Open Reports"
          onPress={() => navigation.navigate('Admin')}
        />

        <AdminCard
          icon="👥"
          title="Manage Users"
          text="Control students, library staff, and shop owner accounts."
          button="Coming Soon"
          onPress={() => {}}
        />

        <AdminCard
          icon="✅"
          title="Approve Shops"
          text="Verify local shop owners and prevent fake listings."
          button="Coming Soon"
          onPress={() => {}}
        />

        <AdminCard
          icon="🛡️"
          title="Remove Fake Listings"
          text="Remove wrong books, fake sellers, and spam data."
          button="Coming Soon"
          onPress={() => {}}
        />
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 100,
  },
  greet: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    color: colors.white,
    fontSize: 31,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 16,
  },
  icon: {
    fontSize: 38,
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  cardText: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 21,
  },
});