import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import { useThemeMode } from '../../context/ThemeContext';

export default function ShopSalesReportScreen() {
  const { theme } = useThemeMode();

  const stats = [
    { label: 'Total Revenue', value: '₹48,250', icon: '💰' },
    { label: 'Books Sold', value: '142', icon: '📚' },
    { label: 'Pending Orders', value: '12', icon: '⏳' },
    { label: 'Avg Sale Value', value: '₹340', icon: '📈' },
  ];

  const topBooks = [
    { title: 'Higher Engineering Mathematics', sold: 24, revenue: '₹14,400' },
    { title: 'Objective Biology for NEET', sold: 18, revenue: '₹6,300' },
    { title: 'Clean Code', sold: 12, revenue: '₹5,400' },
    { title: 'Database System Concepts', sold: 9, revenue: '₹3,150' },
  ];

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <AppHeader
          title="Sales Report"
          subtitle="Store performance & revenue analytics"
          icon="📊"
        />

        <View style={styles.grid}>
          {stats.map((item, idx) => (
            <GlassCard key={idx} style={styles.statCard}>
              <Text style={styles.statIcon}>{item.icon}</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>{item.value}</Text>
              <Text style={[styles.statLabel, { color: theme.muted }]}>{item.label}</Text>
            </GlassCard>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>🏆 Best Selling Books</Text>
        {topBooks.map((book, idx) => (
          <GlassCard key={idx} style={styles.bookCard}>
            <View style={styles.bookRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bookTitle, { color: theme.text }]}>{book.title}</Text>
                <Text style={[styles.bookMeta, { color: theme.muted }]}>{book.sold} units sold</Text>
              </View>
              <Text style={[styles.bookRev, { color: theme.success }]}>{book.revenue}</Text>
            </View>
          </GlassCard>
        ))}

        <GlassCard style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>October 2023 Summary</Text>
          <Text style={[styles.summaryText, { color: theme.muted }]}>
            Your sales have increased by 12% compared to last month. Engineering books remain your top performing category.
          </Text>
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 60 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 10 },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: 16 },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '900' },
  statLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginTop: 20, marginBottom: 12 },
  bookCard: { padding: 14, marginVertical: 6 },
  bookRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bookTitle: { fontSize: 15, fontWeight: '700' },
  bookMeta: { fontSize: 12, marginTop: 2 },
  bookRev: { fontSize: 16, fontWeight: '800' },
  summaryCard: { marginTop: 20, padding: 18 },
  summaryTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  summaryText: { fontSize: 13, lineHeight: 20 },
});