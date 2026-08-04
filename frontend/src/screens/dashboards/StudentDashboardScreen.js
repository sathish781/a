import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import AppScrollView from '../../components/AppScrollView';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
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

export default function StudentDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const exploreActions = [
    {
      icon: '🏠',
      title: 'Home Portal',
      text: 'Return to main home page',
      onPress: () => navigation.navigate('MainTabs', { screen: 'Home' }),
    },
    {
      icon: '🔎',
      title: 'Search Books',
      text: 'Library, shops & market search',
      onPress: () => navigation.navigate('Search'),
    },
    {
      icon: '🛒',
      title: 'Buy Books',
      text: 'Explore student marketplace',
      onPress: () => navigation.navigate('Market'),
    },
    {
      icon: '📸',
      title: 'Sell Books',
      text: 'Post listing for your book',
      onPress: () => navigation.navigate('SellBook'),
    },
    {
      icon: '🔁',
      title: 'Book Exchange',
      text: 'Swap books with campus peers',
      onPress: () => navigation.navigate('Exchange'),
    },
    {
      icon: '🎁',
      title: 'Donate Books',
      text: 'Donation hub & book requests',
      onPress: () => navigation.navigate('Donate'),
    },
    {
      icon: '📋',
      title: 'Reservations',
      text: 'Library book hold status',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: '🔔',
      title: 'Notifications',
      text: 'Alerts & updates on requests',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: '👤',
      title: 'My Profile',
      text: 'Profile & account settings',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <View style={[styles.dashboardWrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* LEFT SIDEBAR: EXPLORE & ACTIONS */}
          <View style={[styles.sidebarColumn, isDesktop && styles.sidebarDesktop]}>
            <GlassCard style={styles.sidebarContainer}>
              <View style={styles.sidebarHeader}>
                <View style={[styles.sidebarBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.sidebarBadgeIcon}>🧭</Text>
                </View>
                <View>
                  <Text style={[styles.sidebarTitle, { color: theme.text }]}>Explore & Navigation</Text>
                  <Text style={[styles.sidebarSubtitle, { color: theme.muted }]}>Student Quick Actions</Text>
                </View>
              </View>

              <View style={styles.navList}>
                {exploreActions.map((item, index) => (
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

          {/* RIGHT MAIN PANEL: STUDENT DASHBOARD OVERVIEW */}
          <View style={[styles.mainColumn, isDesktop && styles.mainDesktop]}>
            <AppHeader
              icon="🎓"
              label="Student Control Center"
              title={`Hi, ${user?.name || 'Student'}`}
              subtitle="Manage your book searches, sales, swaps, donations, and reservations."
            />

            {/* Quick Metrics */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>My Quick Summary</Text>
            <View style={styles.statsRowContainer}>
              <StatBox icon="📚" value="4" label="Listed Books" />
              <StatBox icon="🔁" value="2" label="Active Swaps" />
              <StatBox icon="🎁" value="1" label="Donations" />
              <StatBox icon="📋" value="3" label="Reservations" />
            </View>

            {/* Main Action Hub Cards */}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 12 }]}>Featured Actions</Text>
            
            <GlassCard style={styles.hubCard}>
              <View style={styles.hubHeader}>
                <Text style={styles.hubIcon}>🔎</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hubTitle, { color: theme.text }]}>Smart Multi-Source Book Search</Text>
                  <Text style={[styles.hubText, { color: theme.muted }]}>Find availability & compare prices across college library, local bookstores, and fellow student listings.</Text>
                </View>
              </View>
              <AppButton title="OPEN SEARCH ENGINE →" onPress={() => navigation.navigate('Search')} style={{ marginTop: 10 }} />
            </GlassCard>

            <GlassCard style={styles.hubCard}>
              <View style={styles.hubHeader}>
                <Text style={styles.hubIcon}>📸</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hubTitle, { color: theme.text }]}>Post a Book for Sale / Exchange</Text>
                  <Text style={[styles.hubText, { color: theme.muted }]}>Take photos of your used textbooks, set condition & pricing, and list them instantly for campus buyers.</Text>
                </View>
              </View>
              <AppButton title="POST BOOK FOR SALE →" onPress={() => navigation.navigate('SellBook')} style={{ marginTop: 10 }} />
            </GlassCard>

            <GlassCard style={styles.hubCard}>
              <View style={styles.hubHeader}>
                <Text style={styles.hubIcon}>🔁</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hubTitle, { color: theme.text }]}>Peer-to-Peer Book Exchange Hub</Text>
                  <Text style={[styles.hubText, { color: theme.muted }]}>Directly swap course books with other students without spending extra money.</Text>
                </View>
              </View>
              <AppButton title="GO TO EXCHANGE HUB →" onPress={() => navigation.navigate('Exchange')} style={{ marginTop: 10 }} />
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