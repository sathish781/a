import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppScrollView from '../components/AppScrollView';
import BentoCard from '../components/BentoCard';
import SectionHeader from '../components/SectionHeader';
import AnimatedNumber from '../components/AnimatedNumber';
import { StatCardSkeleton } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import api from '../api/client';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, themeMode } = useThemeMode();
  const isLight = themeMode === 'light';

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Micro-interaction animations
  const avatarScale = useRef(new Animated.Value(1)).current;
  const heroScale = useRef(new Animated.Value(1)).current;
  const searchScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoadingStats(true);
        const res = await api.get('/stats/overview');
        setStats(res.data);
      } catch (e) {
        setStats({ totalBooks: 0, totalLibraries: 0, totalShops: 0, totalExchanges: 0 });
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  function handleAvatarPress() {
    Animated.sequence([
      Animated.timing(avatarScale, { toValue: 0.88, duration: 100, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Profile'));
  }

  function openDashboard() {
    const roleMap = {
      student: 'StudentDashboard',
      library: 'LibraryDashboard',
      shop: 'ShopDashboard',
      admin: 'AdminRoleDashboard',
    };
    navigation.navigate(roleMap[user?.role] || 'StudentDashboard');
  }

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>

        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcome, { color: theme.muted }]}>WELCOME BACK,</Text>
            <Text style={[styles.name, { color: theme.text }]}>
              {user?.name?.split(' ')[0] || 'User'} 👋
            </Text>
          </View>
          <TouchableOpacity activeOpacity={1} onPress={handleAvatarPress}>
            <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
              <LinearGradient colors={[theme.primary, theme.accent]} style={styles.avatar}>
                <Text style={styles.avatarText}>{(user?.name || 'U')[0]}</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Animated Search Bar Launcher */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => Animated.spring(searchScale, { toValue: 0.98, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(searchScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
          onPress={() => navigation.navigate('Search')}
        >
          <Animated.View
            style={[
              styles.searchBar,
              {
                backgroundColor: isLight ? '#ffffff' : theme.backgroundTwo,
                borderColor: theme.glassBorder,
                transform: [{ scale: searchScale }],
              },
            ]}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
            <Text style={[styles.searchPlaceholder, { color: theme.muted }]}>
              Search books, authors, ISBN...
            </Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Hero Dashboard Card */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => Animated.spring(heroScale, { toValue: 0.97, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(heroScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
          onPress={openDashboard}
        >
          <Animated.View style={{ transform: [{ scale: heroScale }] }}>
            <LinearGradient
              colors={[theme.primary, theme.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroContent}>
                <View>
                  <Text style={styles.heroTitle}>Control Center</Text>
                  <Text style={styles.heroSub}>
                    Manage your {user?.role || 'student'} activities & requests
                  </Text>
                </View>
                <View style={styles.heroAction}>
                  <Text style={styles.heroActionText}>OPEN DASHBOARD →</Text>
                </View>
              </View>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3534/3534060.png' }}
                style={styles.heroImage}
              />
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Bento Grid */}
        <SectionHeader title="Explore Platform" />
        <View style={styles.bentoGrid}>
          <View style={styles.bentoRow}>
            <BentoCard
              size="medium"
              title="Smart Search"
              subtitle="Library, Shop & Peers"
              icon="🔎"
              colors={['#3b82f6', '#2563eb']}
              onPress={() => navigation.navigate('Search')}
            />
            <BentoCard
              size="small"
              title="Swap"
              subtitle="Book Exchange"
              icon="🔁"
              colors={['#f97316', '#ea580c']}
              onPress={() => navigation.navigate('Exchange')}
            />
          </View>
          <View style={styles.bentoRow}>
            <BentoCard
              size="small"
              title="Donate"
              subtitle="Give & Receive"
              icon="🎁"
              colors={['#ec4899', '#db2777']}
              onPress={() => navigation.navigate('Donate')}
            />
            <BentoCard
              size="medium"
              title="Marketplace"
              subtitle="Buy & Sell Used Books"
              icon="🛒"
              colors={['#10b981', '#059669']}
              onPress={() => navigation.navigate('Market')}
            />
          </View>
        </View>

        {/* Statistics Section with Animated Counters */}
        {!['library', 'shop'].includes(user?.role) && (
          <>
            <SectionHeader
              title="Live Platform Stats"
              onSeeAll={() => navigation.navigate('ShopsDirectory')}
            />
            {loadingStats ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </ScrollView>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
                <GlassCard style={styles.statCard}>
                  <Text style={styles.statEmoji}>📚</Text>
                  <AnimatedNumber
                    value={stats?.totalBooks || 0}
                    style={[styles.statValue, { color: theme.primary }]}
                  />
                  <Text style={[styles.statLabel, { color: theme.muted }]}>TITLES</Text>
                </GlassCard>

                <GlassCard style={styles.statCard}>
                  <Text style={styles.statEmoji}>🏛️</Text>
                  <AnimatedNumber
                    value={stats?.totalLibraries || 0}
                    style={[styles.statValue, { color: theme.primary }]}
                  />
                  <Text style={[styles.statLabel, { color: theme.muted }]}>LIBRARIES</Text>
                </GlassCard>

                <GlassCard style={styles.statCard}>
                  <Text style={styles.statEmoji}>🏪</Text>
                  <AnimatedNumber
                    value={stats?.totalShops || 0}
                    style={[styles.statValue, { color: theme.primary }]}
                  />
                  <Text style={[styles.statLabel, { color: theme.muted }]}>STORES</Text>
                </GlassCard>

                <GlassCard style={styles.statCard}>
                  <Text style={styles.statEmoji}>🔁</Text>
                  <AnimatedNumber
                    value={stats?.totalExchanges || 0}
                    style={[styles.statValue, { color: theme.primary }]}
                  />
                  <Text style={[styles.statLabel, { color: theme.muted }]}>SWAPS</Text>
                </GlassCard>
              </ScrollView>
            )}
          </>
        )}

        {/* Quick Footer Action */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.postButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('SellBook')}
        >
          <LinearGradient colors={[theme.primary, theme.accent]} style={styles.postGradient}>
            <Text style={styles.postText}>+ LIST YOUR BOOK FOR SALE</Text>
          </LinearGradient>
        </TouchableOpacity>

      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 6,
  },
  welcome: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  name: { fontSize: 24, fontWeight: '900', marginTop: 2, letterSpacing: -0.5 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  searchPlaceholder: { fontSize: 14, fontWeight: '600' },
  heroCard: {
    borderRadius: 28,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  heroContent: { zIndex: 2 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4, fontWeight: '600' },
  heroAction: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  heroActionText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  heroImage: { position: 'absolute', right: -20, bottom: -10, width: 140, height: 140, opacity: 0.25 },
  bentoGrid: { marginTop: 2 },
  bentoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statsScroll: { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 20 },
  statCard: {
    width: 110,
    height: 115,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
  },
  statEmoji: { fontSize: 24, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 9, fontWeight: '800', marginTop: 2, letterSpacing: 0.5 },
  postButton: { borderRadius: 20, marginTop: 10, overflow: 'hidden', elevation: 6 },
  postGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  postText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
