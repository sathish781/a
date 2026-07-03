import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import { colors } from '../../utils/theme';

function LibraryCard({ icon, title, text, button, onPress }) {
  return (
    <GlassCard>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <AppButton title={button} onPress={onPress} />
    </GlassCard>
  );
}

export default function LibraryDashboardScreen({ navigation }) {
  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greet}>Library Staff Panel</Text>
        <Text style={styles.title}>Library Management</Text>

        <LibraryCard
          icon="🏛️"
          title="Create Library"
          text="Add your library name, address, and contact details."
          button="Open Library Panel"
          onPress={() => navigation.navigate('LibraryPanel')}
        />

        <LibraryCard
          icon="📚"
          title="Manage Books"
          text="Add books, shelf number, total copies, and available copies."
          button="Manage Books"
          onPress={() => navigation.navigate('LibraryPanel')}
        />

        <LibraryCard
          icon="📌"
          title="Reservations"
          text="Students can reserve books and collect from library."
          button="View Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />

        <LibraryCard
          icon="⏳"
          title="Return Date and Fine"
          text="Mention due date. Late returns can calculate fine amount."
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