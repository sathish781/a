import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';

import { useThemeMode } from '../../context/ThemeContext';

function LibraryCard({ icon, title, text, button, onPress }) {
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

export default function LibraryDashboardScreen({ navigation }) {
  const { theme } = useThemeMode();

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.greet, { color: theme.primary }]}>LIBRARY PANEL</Text>
          <Text style={[styles.title, { color: theme.text }]}>Library Dashboard</Text>
        </View>

        <LibraryCard
          icon="📚"
          title="Library Books Catalog"
          text="View and manage all books cataloged in your library."
          button="LIBRARY BOOKS"
          onPress={() => navigation.navigate('LibraryPanel')}
        />

        <LibraryCard
          icon="➕"
          title="Add New Books"
          text="Add new book titles, ISBNs, authors, and copy counts."
          button="ADD BOOKS"
          onPress={() => navigation.navigate('LibraryPanel')}
        />

        <LibraryCard
          icon="🔄"
          title="Update Book Availability"
          text="Mark book copies as available, checked out, or reserved."
          button="UPDATE AVAILABILITY"
          onPress={() => navigation.navigate('LibraryPanel')}
        />

        <LibraryCard
          icon="📌"
          title="Reservation Requests"
          text="Approve or decline student book hold requests."
          button="RESERVATION REQUESTS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <LibraryCard
          icon="⏳"
          title="Borrow History & Reports"
          text="Track past and active book loans, due dates, and returns."
          button="BORROW HISTORY"
          onPress={() => navigation.navigate('LibraryPanel')}
        />

        <LibraryCard
          icon="📩"
          title="Student Inquiries"
          text="View and respond to student book availability requests."
          button="STUDENT REQUESTS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <LibraryCard
          icon="🔔"
          title="Notifications"
          text="Receive notifications for new reservation alerts."
          button="NOTIFICATIONS"
          onPress={() => navigation.navigate('Notifications')}
        />

        <LibraryCard
          icon="👤"
          title="Library Profile"
          text="Update library address, contact details, and timings."
          button="LIBRARY PROFILE"
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