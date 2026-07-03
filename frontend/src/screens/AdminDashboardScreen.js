import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, ActivityIndicator, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function AdminDashboardScreen() {
  const [data, setData] = useState(null);

  async function loadDashboard() {
    try {
      const res = await api.get('/reports/dashboard');
      setData(res.data);
    } catch (error) {
      Alert.alert('Error', 'Admin dashboard loading failed');
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!data) {
    return (
      <GlassScreen>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>System reports and analytics.</Text>

        <View style={styles.grid}>
          <StatCard icon="👥" label="Users" value={data.totalUsers} />
          <StatCard icon="📚" label="Books" value={data.totalBooks} />
          <StatCard icon="🏛️" label="Libraries" value={data.totalLibraries} />
          <StatCard icon="🏪" label="Shops" value={data.totalShops} />
          <StatCard icon="🛒" label="Listings" value={data.totalMarketplace} />
          <StatCard icon="🎁" label="Donations" value={data.totalDonations} />
          <StatCard icon="🔁" label="Exchanges" value={data.totalExchanges} />
          <StatCard icon="📌" label="Reservations" value={data.totalReservations} />
        </View>

        <Text style={styles.sectionTitle}>Books by Exam Type</Text>

        {data.booksByExam.map((item) => (
          <GlassCard key={item._id || 'Academic'}>
            <Text style={styles.cardText}>
              {item._id || 'Academic'}: {item.total}
            </Text>
          </GlassCard>
        ))}

        <Text style={styles.sectionTitle}>Latest Users</Text>

        {data.latestUsers.map((item) => (
          <GlassCard key={item._id}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>{item.email}</Text>
            <Text style={styles.badge}>{item.role}</Text>
          </GlassCard>
        ))}
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 100
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 14
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 8
  },
  cardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900'
  },
  cardText: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 4
  },
  badge: {
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
    fontWeight: '800'
  }
});