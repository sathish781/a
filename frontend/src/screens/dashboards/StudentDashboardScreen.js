import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedNumber from '../../components/AnimatedNumber';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import api from '../../api/client';

export default function StudentDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, themeMode } = useThemeMode();
  const isLight = themeMode === 'light';

  const [stats, setStats] = useState({
    listedBooks: 0,
    activeSwaps: 0,
    donations: 0,
    reservations: 0,
  });

  async function fetchStats() {
    try {
      const res = await api.get('/stats/student-dashboard');
      setStats(res.data);
    } catch (error) {
      setStats({ listedBooks: 0, activeSwaps: 0, donations: 0, reservations: 0 });
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStats();
    });
    return unsubscribe;
  }, [navigation]);

  const studentActions = [
    { title: 'My Listings', sub: 'Books you are selling', icon: '📦', route: 'Market', color: '#6366f1' },
    { title: 'Active Swaps', sub: 'Your pending exchanges', icon: '🔁', route: 'Exchange', color: '#f59e0b' },
    { title: 'My Donations', sub: 'Free books you shared', icon: '🎁', route: 'Donate', color: '#ec4899' },
    { title: 'Hold History', sub: 'Library issued books', icon: '📋', route: 'BorrowHistory', color: '#10b981' },
  ];

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Profile Card */}
        <LinearGradient
          colors={isLight ? ['#ffffff', '#f8fafc'] : [theme.backgroundTwo, theme.backgroundOne]}
          style={[styles.profileCard, { borderColor: theme.glassBorder }]}
        >
          <View style={styles.profileRow}>
            <LinearGradient colors={[theme.primary, theme.accent]} style={styles.largeAvatar}>
              <Text style={styles.avatarTxt}>{(user?.name || 'U')[0]}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>
              <Text style={[styles.userCollege, { color: theme.muted }]}>
                {user?.college || 'University Student'}
              </Text>
              <View style={[styles.roleBadge, { backgroundColor: theme.primary + '18' }]}>
                <Text style={[styles.roleTxt, { color: theme.primary }]}>STUDENT PORTAL</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats Grid with Animated Counters */}
        <SectionHeader title="Your Activity" />
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: '#6366f1' }]}>
            <AnimatedNumber value={stats.listedBooks} style={styles.statVal} />
            <Text style={styles.statLab}>LISTED</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#f59e0b' }]}>
            <AnimatedNumber value={stats.activeSwaps} style={styles.statVal} />
            <Text style={styles.statLab}>SWAPS</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#ec4899' }]}>
            <AnimatedNumber value={stats.donations} style={styles.statVal} />
            <Text style={styles.statLab}>GIFTS</Text>
          </View>
        </View>

        {/* Management Grid */}
        <SectionHeader title="Management Hub" />
        <View style={styles.menuGrid}>
          {studentActions.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route)}
              activeOpacity={0.88}
            >
              <GlassCard style={styles.menuCard}>
                <View style={[styles.menuIconBox, { backgroundColor: item.color + '18' }]}>
                  <Text style={styles.menuEmoji}>{item.icon}</Text>
                </View>
                <Text style={[styles.menuTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.menuSub, { color: theme.muted }]}>{item.sub}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Notifications Shortcut */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.notifBar,
            { backgroundColor: theme.backgroundTwo, borderColor: theme.glassBorder },
          ]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={{ fontSize: 20 }}>🔔</Text>
          <Text style={[styles.notifText, { color: theme.text }]}>Check for new swap requests & alerts</Text>
          <Text style={{ color: theme.primary, fontWeight: '900', fontSize: 18 }}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },
  profileCard: {
    padding: 22,
    borderRadius: 28,
    borderWidth: 1.5,
    marginBottom: 20,
    elevation: 4,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  largeAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  avatarTxt: { color: '#fff', fontSize: 32, fontWeight: '900' },
  profileInfo: { marginLeft: 16, flex: 1 },
  userName: { fontSize: 20, fontWeight: '900', letterSpacing: -0.4 },
  userCollege: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  roleTxt: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statBox: {
    width: '31%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  statVal: { color: '#fff', fontSize: 24, fontWeight: '900' },
  statLab: { color: 'rgba(255,255,255,0.85)', fontSize: 9, fontWeight: '800', marginTop: 2 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: { width: '48%', marginBottom: 14 },
  menuCard: { padding: 16, alignItems: 'flex-start', marginVertical: 0, borderRadius: 22 },
  menuIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  menuEmoji: { fontSize: 22 },
  menuTitle: { fontSize: 15, fontWeight: '900' },
  menuSub: { fontSize: 10, marginTop: 4, lineHeight: 14, fontWeight: '500' },
  notifBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 10,
    gap: 12,
  },
  notifText: { flex: 1, fontSize: 13, fontWeight: '700' },
});
