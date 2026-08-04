import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import AppScrollView from '../../components/AppScrollView';
import AppHeader from '../../components/AppHeader';
import { useThemeMode } from '../../context/ThemeContext';

function SidebarActionItem({ icon, title, text, onPress }) {
  const { theme } = useThemeMode();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ width: '100%' }}>
      <GlassCard style={styles.navCard}>
        <View style={styles.navCardRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#090a14', borderColor: theme.primary }]}>
            <Text style={styles.navCardIcon}>{icon}</Text>
          </View>
          <View style={styles.navCardTextContainer}>
            <Text style={[styles.navCardTitle, { color: theme.text }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.navCardSubtext, { color: theme.muted }]} numberOfLines={1}>
              {text}
            </Text>
          </View>
          <Text style={[styles.arrowIcon, { color: theme.primary }]}>→</Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

function StatBox({ icon, value, label }) {
  const { theme } = useThemeMode();
  return (
    <View style={[styles.statBox, { borderColor: theme.glassBorder, backgroundColor: theme.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15, 17, 32, 0.6)' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

export default function LibraryDashboardScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const libraryActions = [
    {
      icon: '📚',
      title: 'Library Catalog',
      text: 'View & manage all cataloged books',
      onPress: () => navigation.navigate('LibraryPanel'),
    },
    {
      icon: '➕',
      title: 'Add New Books',
      text: 'Add ISBNs, titles, authors & stock',
      onPress: () => navigation.navigate('LibraryPanel'),
    },
    {
      icon: '🔄',
      title: 'Update Availability',
      text: 'Mark available or checked out',
      onPress: () => navigation.navigate('LibraryPanel'),
    },
    {
      icon: '📌',
      title: 'Hold Requests',
      text: 'Approve or decline hold requests',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: '⏳',
      title: 'Borrow History',
      text: 'Track active loans & due dates',
      onPress: () => navigation.navigate('LibraryPanel'),
    },
    {
      icon: '📩',
      title: 'Student Inquiries',
      text: 'Respond to book availability queries',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: '🔔',
      title: 'Notifications',
      text: 'Reservation & system alerts',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: '👤',
      title: 'Library Profile',
      text: 'Update address, contact & hours',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <View style={[styles.dashboardWrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* LEFT SIDEBAR: LIBRARY ACTIONS */}
          <View style={[styles.sidebarColumn, isDesktop && styles.sidebarDesktop]}>
            <GlassCard style={styles.sidebarContainer}>
              <View style={styles.sidebarHeader}>
                <View style={[styles.sidebarBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.sidebarBadgeIcon}>🏛️</Text>
                </View>
                <View>
                  <Text style={[styles.sidebarTitle, { color: theme.text }]}>Library Actions</Text>
                  <Text style={[styles.sidebarSubtitle, { color: theme.muted }]}>Manage Library Systems</Text>
                </View>
              </View>

              <View style={styles.navList}>
                {libraryActions.map((item, index) => (
                  <SidebarActionItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    text={item.text}
                    onPress={item.onPress}
                  />
                ))}
              </View>
            </GlassCard>
          </View>

          {/* RIGHT MAIN PANEL: LIBRARY DASHBOARD OVERVIEW */}
          <View style={[styles.mainColumn, isDesktop && styles.mainDesktop]}>
            <AppHeader
              icon="🏛️"
              label="Library Panel"
              title="Library Dashboard"
              subtitle="Oversee catalog inventories, manage student holds, and monitor loans."
            />

            {/* Quick Metrics */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Library Overview Stats</Text>
            <View style={styles.statsRowContainer}>
              <StatBox icon="📚" value="850" label="Catalog Titles" />
              <StatBox icon="📌" value="12" label="Pending Holds" />
              <StatBox icon="⏳" value="45" label="Active Loans" />
              <StatBox icon="✅" value="8" label="Returned Today" />
            </View>

            {/* Main Action Cards */}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>Core Management Modules</Text>
            
            <GlassCard style={styles.hubCard}>
              <View style={styles.hubHeader}>
                <Text style={styles.hubIcon}>📚</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hubTitle, { color: theme.text }]}>Manage Book Catalog & Copies</Text>
                  <Text style={[styles.hubText, { color: theme.muted }]}>Add new arrivals, update copy counts, barcode ISBNs, and toggle borrowing status.</Text>
                </View>
              </View>
              <AppButton title="OPEN CATALOG MANAGER →" onPress={() => navigation.navigate('LibraryPanel')} style={{ marginTop: 10 }} />
            </GlassCard>

            <GlassCard style={styles.hubCard}>
              <View style={styles.hubHeader}>
                <Text style={styles.hubIcon}>📌</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hubTitle, { color: theme.text }]}>Student Hold & Reservation Requests</Text>
                  <Text style={[styles.hubText, { color: theme.muted }]}>Review pending hold requests submitted by students and approve books for pickup.</Text>
                </View>
              </View>
              <AppButton title="VIEW RESERVATIONS →" onPress={() => navigation.navigate('Notifications')} style={{ marginTop: 10 }} />
            </GlassCard>

          </View>
        </View>
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 90,
  },
  dashboardWrapper: {
    gap: 16,
  },
  sidebarColumn: {
    width: '100%',
  },
  sidebarDesktop: {
    width: 320,
  },
  mainColumn: {
    flex: 1,
  },
  mainDesktop: {
    flex: 1,
  },
  sidebarContainer: {
    padding: 16,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  sidebarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sidebarBadgeIcon: {
    fontSize: 20,
  },
  sidebarTitle: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  sidebarSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  navList: {
    gap: 6,
  },
  navCard: {
    padding: 10,
    marginVertical: 2,
  },
  navCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  navCardIcon: {
    fontSize: 18,
  },
  navCardTextContainer: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  navCardSubtext: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  statsRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    minWidth: 110,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  hubCard: {
    padding: 16,
    marginBottom: 12,
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hubIcon: {
    fontSize: 28,
    marginRight: 12,
    marginTop: 2,
  },
  hubTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  hubText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});