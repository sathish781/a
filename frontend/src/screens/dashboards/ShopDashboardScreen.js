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

export default function ShopDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { theme, themeMode } = useThemeMode();
  const isLight = themeMode === 'light';

  const [stats, setStats] = useState({
    inStockBooks: 0,
    pendingOrders: 0,
    inquiries: 0,
    monthlySales: 0,
  });

  async function fetchStats() {
    try {
      const res = await api.get('/stats/shop-dashboard');
      setStats(res.data);
    } catch (e) {
      setStats({ inStockBooks: 0, pendingOrders: 0, inquiries: 0, monthlySales: 0 });
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStats();
    });
    return unsubscribe;
  }, [navigation]);

  const shopActions = [
    { title: 'Add Inventory', sub: 'List new books', icon: '📦', route: 'ShopPanel', color: '#f97316' },
    { title: 'Stock Manager', sub: 'Manage prices', icon: '📊', route: 'ShopInventory', color: '#3b82f6' },
    { title: 'Customer Orders', sub: 'Process requests', icon: '🛒', route: 'ShopOrders', color: '#10b981' },
    { title: 'Sales Report', sub: 'Revenue analytics', icon: '📈', route: 'ShopSalesReport', color: '#6366f1' },
  ];

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Store Header */}
        <LinearGradient
          colors={isLight ? ['#ffffff', '#f8fafc'] : [theme.backgroundTwo, theme.backgroundOne]}
          style={[styles.storeCard, { borderColor: theme.glassBorder }]}
        >
          <View style={styles.storeRow}>
            <View style={[styles.storeIconWrap, { backgroundColor: theme.primary + '18' }]}>
              <Text style={{ fontSize: 38 }}>🏪</Text>
            </View>
            <View style={styles.storeInfo}>
              <Text style={[styles.storeName, { color: theme.text }]} numberOfLines={1}>
                {user?.shopName || 'Local Book Store'}
              </Text>
              <Text style={[styles.storeLoc, { color: theme.muted }]}>
                {user?.location || 'Business Owner'}
              </Text>
              <View style={[styles.bizBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.bizText}>VERIFIED BUSINESS</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Revenue Highlight with Animated Counter */}
        <SectionHeader title="Store Analytics" />
        <GlassCard style={styles.revenueCard}>
          <Text style={[styles.revLab, { color: theme.muted }]}>TOTAL MONTHLY REVENUE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <Text style={[styles.currencySymbol, { color: theme.primary }]}>₹</Text>
            <AnimatedNumber
              value={stats.monthlySales}
              style={[styles.revVal, { color: theme.primary }]}
            />
          </View>
          <View style={[styles.revTrend, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
            <Text style={{ color: theme.success, fontWeight: '800', fontSize: 11 }}>
              + 12.5% vs last month
            </Text>
          </View>
        </GlassCard>

        {/* Action Grid */}
        <View style={styles.menuGrid}>
          {shopActions.map((item, idx) => (
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

        {/* Summary Footer */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: theme.backgroundTwo }]}>
            <AnimatedNumber
              value={stats.inStockBooks}
              style={[styles.sumVal, { color: theme.text }]}
            />
            <Text style={[styles.sumLab, { color: theme.muted }]}>IN STOCK</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: theme.backgroundTwo }]}>
            <AnimatedNumber
              value={stats.pendingOrders}
              style={[styles.sumVal, { color: theme.text }]}
            />
            <Text style={[styles.sumLab, { color: theme.muted }]}>PENDING</Text>
          </View>
        </View>

      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },
  storeCard: { padding: 22, borderRadius: 28, borderWidth: 1.5, marginBottom: 20, elevation: 4 },
  storeRow: { flexDirection: 'row', alignItems: 'center' },
  storeIconWrap: { width: 66, height: 66, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  storeInfo: { marginLeft: 16, flex: 1 },
  storeName: { fontSize: 19, fontWeight: '900' },
  storeLoc: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  bizBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  bizText: { color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 0.5 },
  revenueCard: { padding: 20, alignItems: 'center', borderRadius: 24 },
  revLab: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  currencySymbol: { fontSize: 28, fontWeight: '900' },
  revVal: { fontSize: 32, fontWeight: '900' },
  revTrend: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 4 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 },
  menuItem: { width: '48%', marginBottom: 14 },
  menuCard: { padding: 16, alignItems: 'flex-start', marginVertical: 0, borderRadius: 22 },
  menuIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  menuEmoji: { fontSize: 20 },
  menuTitle: { fontSize: 14, fontWeight: '900' },
  menuSub: { fontSize: 10, marginTop: 3, fontWeight: '500' },
  summaryRow: { flexDirection: 'row', gap: 12, marginTop: 5 },
  summaryBox: { flex: 1, padding: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sumVal: { fontSize: 20, fontWeight: '900' },
  sumLab: { fontSize: 9, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
});
