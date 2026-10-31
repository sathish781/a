import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import SectionHeader from '../../components/SectionHeader';
import AnimatedNumber from '../../components/AnimatedNumber';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import api from '../../api/client';

export default function LibraryDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, themeMode } = useThemeMode();
  const isLight = themeMode === 'light';

  const [stats, setStats] = useState({
    catalogTitles: 0,
    pendingHolds: 0,
    activeLoans: 0,
    returnedToday: 0,
  });

  async function fetchStats() {
    try {
      const res = await api.get('/stats/library-dashboard');
      setStats(res.data);
    } catch (e) {
      console.log('Lib stats error');
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStats();
    });
    return unsubscribe;
  }, [navigation]);

  const libActions = [
    { title: 'Add New Book', sub: 'Expand catalog', icon: '➕', route: 'LibraryPanel', color: '#3b82f6' },
    { title: 'Catalog Mgt', sub: 'Edit book info', icon: '📚', route: 'LibraryInventory', color: '#10b981' },
    { title: 'Borrow History', sub: 'View logs', icon: '📋', route: 'LibraryHistory', color: '#f97316' },
    { title: 'Manage Requests', sub: 'Student holds', icon: '🔔', route: 'ManageLibraryRequests', color: '#6366f1' },
  ];

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Institutional Header */}
        <LinearGradient
          colors={isLight ? ['#ffffff', '#f8fafc'] : [theme.backgroundTwo, theme.backgroundOne]}
          style={[styles.libCard, { borderColor: theme.glassBorder }]}
        >
          <View style={styles.libRow}>
            <View style={[styles.libIconWrap, { backgroundColor: '#3b82f618' }]}>
              <Text style={{ fontSize: 36 }}>🏛️</Text>
            </View>
            <View style={styles.libInfo}>
              <Text style={[styles.libName, { color: theme.text }]} numberOfLines={1}>
                {user?.libraryName || 'College Library'}
              </Text>
              <Text style={[styles.libLoc, { color: theme.muted }]}>
                {user?.location || 'Campus Authority'}
              </Text>
              <View style={[styles.instBadge, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.instText}>OFFICIAL INSTITUTION</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Catalog Metrics with Animated Numbers */}
        <SectionHeader title="Loan Statistics" />
        <View style={styles.statsRow}>
          <GlassCard style={styles.statBox}>
            <AnimatedNumber
              value={stats.activeLoans}
              style={[styles.statVal, { color: theme.primary }]}
            />
            <Text style={[styles.statLab, { color: theme.muted }]}>ACTIVE LOANS</Text>
          </GlassCard>
          <GlassCard style={styles.statBox}>
            <AnimatedNumber
              value={stats.pendingHolds}
              style={[styles.statVal, { color: theme.primary }]}
            />
            <Text style={[styles.statLab, { color: theme.muted }]}>PENDING HOLDS</Text>
          </GlassCard>
        </View>

        {/* Action Grid */}
        <SectionHeader title="Library Operations" />
        <View style={styles.menuGrid}>
          {libActions.map((item, idx) => (
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

        {/* Total Catalog Footer */}
        <GlassCard style={styles.footerCard}>
          <View style={styles.footerRow}>
            <View>
              <Text style={[styles.footerLab, { color: theme.muted }]}>TOTAL CATALOG TITLES</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <AnimatedNumber
                  value={stats.catalogTitles}
                  style={[styles.footerVal, { color: theme.text }]}
                />
                <Text style={[styles.footerSubText, { color: theme.muted }]}> TITLES REGISTERED</Text>
              </View>
            </View>
            <View style={[styles.plusCircle, { backgroundColor: theme.primary }]}>
              <Text style={{ color: '#fff', fontSize: 20 }}>📚</Text>
            </View>
          </View>
        </GlassCard>

      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },
  libCard: { padding: 22, borderRadius: 28, borderWidth: 1.5, marginBottom: 20, elevation: 4 },
  libRow: { flexDirection: 'row', alignItems: 'center' },
  libIconWrap: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  libInfo: { marginLeft: 16, flex: 1 },
  libName: { fontSize: 19, fontWeight: '900' },
  libLoc: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  instBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  instText: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 5 },
  statBox: { flex: 1, padding: 18, alignItems: 'center', marginVertical: 0, borderRadius: 22 },
  statVal: { fontSize: 26, fontWeight: '900' },
  statLab: { fontSize: 9, fontWeight: '800', marginTop: 3, letterSpacing: 0.5 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuItem: { width: '48%', marginBottom: 14 },
  menuCard: { padding: 16, alignItems: 'flex-start', marginVertical: 0, borderRadius: 22 },
  menuIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  menuEmoji: { fontSize: 20 },
  menuTitle: { fontSize: 14, fontWeight: '900' },
  menuSub: { fontSize: 10, marginTop: 3, fontWeight: '500' },
  footerCard: { padding: 18, borderRadius: 22, marginTop: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLab: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  footerVal: { fontSize: 18, fontWeight: '900' },
  footerSubText: { fontSize: 12, fontWeight: '700' },
  plusCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
