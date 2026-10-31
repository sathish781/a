import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import SectionHeader from '../../components/SectionHeader';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import api from '../../api/client';

export default function AdminRoleDashboardScreen({ navigation }) {
  const { theme, themeMode } = useThemeMode();
  const isLight = themeMode === 'light';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    try {
      setLoading(true);
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (e) {
      setStats({ totalUsers: 0, totalBooks: 0, totalLibraries: 0, totalShops: 0, totalDonations: 0, totalExchanges: 0, pendingShops: 0, todayActivity: { newUsers: 0 } });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStats();
    });
    return unsubscribe;
  }, [navigation]);

  const adminModules = [
    { title: 'User Manager', sub: 'Control access', icon: '👥', route: 'UserManagement', color: '#6366f1' },
    { title: 'Org Approvals', sub: 'Verify stores', icon: '🛡️', route: 'OrganizationApproval', color: '#f59e0b' },
    { title: 'Global Catalog', sub: 'Audit listings', icon: '📚', route: 'AdminBookCatalog', color: '#3b82f6' },
    { title: 'Market Moderation', sub: 'Review sales', icon: '🛒', route: 'AdminMarketplace', color: '#10b981' },
  ];

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Admin Command Header */}
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.adminHeader}
        >
          <View style={styles.headerRow}>
             <View>
                <Text style={styles.adminLabel}>SYSTEM ADMINISTRATOR</Text>
                <Text style={styles.adminTitle}>Master Control</Text>
             </View>
             <View style={styles.pulseDot} />
          </View>
          
          <View style={styles.quickStatus}>
             <Text style={styles.statusText}>● PLATFORM STATUS: ONLINE</Text>
             <Text style={styles.versionText}>v2.0.4 - STABLE</Text>
          </View>
        </LinearGradient>

        {/* Real-time Counters */}
        <SectionHeader title="System Metrics" />
        <View style={styles.metricsGrid}>
           <View style={[styles.metricItem, { backgroundColor: theme.backgroundTwo }]}>
              <Text style={[styles.metricVal, { color: theme.primary }]}>{stats?.totalUsers}</Text>
              <Text style={[styles.metricLab, { color: theme.muted }]}>USERS</Text>
           </View>
           <View style={[styles.metricItem, { backgroundColor: theme.backgroundTwo }]}>
              <Text style={[styles.metricVal, { color: theme.primary }]}>{stats?.totalBooks}</Text>
              <Text style={[styles.metricLab, { color: theme.muted }]}>BOOKS</Text>
           </View>
           <View style={[styles.metricItem, { backgroundColor: theme.backgroundTwo }]}>
              <Text style={[styles.metricVal, { color: theme.primary }]}>{stats?.pendingShops}</Text>
              <Text style={[styles.metricLab, { color: theme.muted }]}>PENDING</Text>
           </View>
        </View>

        {/* Management Modules */}
        <SectionHeader title="Control Modules" />
        <View style={styles.moduleGrid}>
           {adminModules.map((m, idx) => (
             <TouchableOpacity key={idx} style={styles.moduleItem} onPress={() => navigation.navigate(m.route)}>
                <GlassCard style={styles.moduleCard}>
                   <View style={[styles.moduleIcon, { backgroundColor: m.color + '20' }]}>
                      <Text style={{ fontSize: 24 }}>{m.icon}</Text>
                   </View>
                   <Text style={[styles.moduleTitle, { color: theme.text }]}>{m.title}</Text>
                   <Text style={[styles.moduleSub, { color: theme.muted }]}>{m.sub}</Text>
                </GlassCard>
             </TouchableOpacity>
           ))}
        </View>

        {/* Critical Maintenance Tasks */}
        <SectionHeader title="System Operations" />
        <GlassCard style={styles.opsCard}>
           <Text style={[styles.opsTitle, { color: theme.text }]}>Global Announcements</Text>
           <Text style={[styles.opsSub, { color: theme.muted }]}>Broadcast important updates to all users instantly.</Text>
           <AppButton title="OPEN BROADCAST CENTER" onPress={() => navigation.navigate('AdminDashboard')} style={{ marginTop: 15 }} />
        </GlassCard>

        <TouchableOpacity
          style={[styles.securityBar, { backgroundColor: theme.backgroundTwo }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={{ fontSize: 20 }}>🔒</Text>
          <Text style={[styles.securityText, { color: theme.text }]}>Security Audit & Logs</Text>
          <Text style={{ color: theme.primary, fontWeight: '900' }}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },
  adminHeader: { padding: 30, borderRadius: 32, marginBottom: 25, elevation: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  adminLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  adminTitle: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 5 },
  pulseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981', shadowColor: '#10b981', shadowRadius: 10, shadowOpacity: 1, elevation: 10 },
  quickStatus: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
  statusText: { color: '#10b981', fontSize: 10, fontWeight: '900' },
  versionText: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metricItem: { flex: 1, padding: 18, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  metricVal: { fontSize: 22, fontWeight: '900' },
  metricLab: { fontSize: 9, fontWeight: '800', marginTop: 4 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moduleItem: { width: '48%', marginBottom: 15 },
  moduleCard: { padding: 20, marginVertical: 0, borderRadius: 24 },
  moduleIcon: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  moduleTitle: { fontSize: 15, fontWeight: '900' },
  moduleSub: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  opsCard: { padding: 22, borderRadius: 28 },
  opsTitle: { fontSize: 18, fontWeight: '900' },
  opsSub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  securityBar: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, marginTop: 15, gap: 15 },
  securityText: { flex: 1, fontSize: 14, fontWeight: '700' },
});
