import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, useWindowDimensions } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import AppScrollView from '../components/AppScrollView';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { radius } from '../utils/theme';
import { useThemeMode } from '../context/ThemeContext';

function ExploreNavItem({ icon, title, text, onPress }) {
  const { theme } = useThemeMode();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ width: '100%' }}>
      <GlassCard style={styles.navCard}>
        <View style={styles.navCardRow}>
          <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#090a14', borderColor: theme.glassBorder }]}>
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

function StatBox({ icon, label, value }) {
  const { theme } = useThemeMode();
  return (
    <View style={[styles.statBox, { borderColor: theme.glassBorder, backgroundColor: theme.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15, 17, 32, 0.6)' }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.muted }]}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

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

  const exploreItems = [
    {
      icon: '🔎',
      title: 'Smart Search',
      text: 'Find books by title, author or subject',
      onPress: () => navigation.navigate('Search'),
    },
    {
      icon: '📸',
      title: 'Sell Books',
      text: 'Upload photos & list your book',
      onPress: () => navigation.navigate('SellBook'),
    },
    {
      icon: '💰',
      title: 'Compare Prices',
      text: 'Library vs student vs shop prices',
      onPress: () => navigation.navigate('Search'),
    },
    {
      icon: '🔁',
      title: 'Book Exchange',
      text: 'Swap books directly with campus peers',
      onPress: () => navigation.navigate('Exchange'),
    },
    {
      icon: '🎁',
      title: 'Donate Books',
      text: 'Give away or request book donations',
      onPress: () => navigation.navigate('Donate'),
    },
    {
      icon: '🔔',
      title: 'Alerts & Updates',
      text: 'Track reservations and hold status',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      icon: '👤',
      title: 'My Profile',
      text: 'Manage profile and preferences',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        <View style={[styles.dashboardWrapper, { flexDirection: isDesktop ? 'row' : 'column' }]}>
          
          {/* LEFT SIDEBAR: EXPLORE FEATURES */}
          <View style={[styles.sidebarColumn, isDesktop && styles.sidebarDesktop]}>
            <GlassCard style={styles.sidebarContainer}>
              <View style={styles.sidebarHeader}>
                <View style={[styles.sidebarBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.sidebarBadgeIcon}>🧭</Text>
                </View>
                <View>
                  <Text style={[styles.sidebarTitle, { color: theme.text }]}>Explore Features</Text>
                  <Text style={[styles.sidebarSubtitle, { color: theme.muted }]}>Quick Navigation Menu</Text>
                </View>
              </View>

              <View style={styles.navList}>
                {exploreItems.map((item, index) => (
                  <ExploreNavItem
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

          {/* RIGHT MAIN PANEL: DASHBOARD HERO & STATS */}
          <View style={[styles.mainColumn, isDesktop && styles.mainDesktop]}>
            <AppHeader
              icon="📚"
              label={`Welcome, ${user?.name || user?.shopName || user?.libraryName || 'User'}`}
              title="BookConnect"
              subtitle="Find books from library, local shops, and student marketplace."
            />

            {/* Main Hero Banner */}
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
                <View style={[styles.redBadge, { borderColor: theme.primary, backgroundColor: theme.mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.15)' }]}>
                  <Text style={[styles.redBadgeText, { color: theme.primary }]}>Role: {user?.role || 'student'}</Text>
                </View>

                <View style={[styles.redBadge, { borderColor: theme.primary, backgroundColor: theme.mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.15)' }]}>
                  <Text style={[styles.redBadgeText, { color: theme.primary }]}>Mode: {theme.mode === 'light' ? 'Light Theme' : 'Dark Mode'}</Text>
                </View>
              </View>

              <AppButton
                title="OPEN MY DASHBOARD →"
                onPress={openDashboard}
                style={{ width: '100%', marginTop: 8 }}
              />
            </GlassCard>

            {/* Overview Stats Row */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Dashboard Overview</Text>
            <View style={styles.statsRowContainer}>
              <StatBox icon="📚" value="1.2k+" label="Total Books" />
              <StatBox icon="🏛️" value="12" label="Libraries" />
              <StatBox icon="🏪" value="18" label="Local Shops" />
              <StatBox icon="🔁" value="140+" label="Student Swaps" />
            </View>

            {/* Quick Feature Highlights */}
            <View style={styles.quickHighlightsRow}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('Search')}>
                <GlassCard style={styles.highlightCard}>
                  <Text style={styles.highlightIcon}>⚡</Text>
                  <Text style={[styles.highlightTitle, { color: theme.text }]}>Instant Search</Text>
                  <Text style={[styles.highlightSub, { color: theme.muted }]}>Browse catalog across 3 sources</Text>
                </GlassCard>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1, marginLeft: 10 }} onPress={() => navigation.navigate('SellBook')}>
                <GlassCard style={styles.highlightCard}>
                  <Text style={styles.highlightIcon}>✨</Text>
                  <Text style={[styles.highlightTitle, { color: theme.text }]}>Sell & Earn</Text>
                  <Text style={[styles.highlightSub, { color: theme.muted }]}>List unused textbooks in seconds</Text>
                </GlassCard>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
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
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  sidebarSubtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  navList: {
    gap: 8,
  },
  navCard: {
    padding: 12,
    marginVertical: 3,
  },
  navCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  navCardIcon: {
    fontSize: 20,
  },
  navCardTextContainer: {
    flex: 1,
  },
  navCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  navCardSubtext: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 6,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 8,
    marginBottom: 20,
  },
  heroBadgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  heroIcon: {
    fontSize: 34,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroText: {
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
    justifyContent: 'center',
    gap: 8,
  },
  redBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 18,
  },
  redBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  statsRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: 120,
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
  quickHighlightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  highlightCard: {
    padding: 14,
  },
  highlightIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  highlightSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});