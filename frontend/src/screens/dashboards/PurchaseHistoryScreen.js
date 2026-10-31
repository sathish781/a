import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function PurchaseHistoryScreen() {
  const { theme } = useThemeMode();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      setLoading(true);
      const res = await api.get('/shop-requests/student');
      setRequests(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch purchase history.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading && requests.length === 0) {
    return (
      <GlassScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader title="Shop Requests" subtitle="Your book purchase inquiries" icon="🛒" />

        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          onRefresh={loadHistory}
          refreshing={loading}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>No purchase records found.</Text>}
          renderItem={({ item }) => (
            <GlassCard style={styles.card}>
              <View style={styles.header}>
                <Text style={[styles.bookTitle, { color: theme.text }]}>{item.bookId?.title}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: item.status === 'ACCEPTED' || item.status === 'COMPLETED' ? theme.success : item.status === 'REJECTED' ? theme.danger : '#f59e0b' }
                ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.details}>
                <Text style={[styles.info, { color: theme.muted }]}>🏪 Shop: {item.shopId?.shopName || item.shopId?.name}</Text>
                <Text style={[styles.info, { color: theme.muted }]}>📍 Location: {item.shopId?.shopAddress || item.shopId?.location}</Text>
                <Text style={[styles.info, { color: theme.muted }]}>📞 Mobile: {item.shopId?.phone}</Text>
                <Text style={[styles.price, { color: theme.primary }]}>Amount: ₹{item.price}</Text>

                {item.status === 'ACCEPTED' && (
                  <Text style={[styles.collectMsg, { color: theme.success }]}>✅ READY FOR COLLECTION</Text>
                )}
              </View>
            </GlassCard>
          )}
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 16, marginVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bookTitle: { fontSize: 16, fontWeight: '800', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  details: { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
  info: { fontSize: 13, marginVertical: 1 },
  price: { fontSize: 15, fontWeight: '900', marginTop: 8 },
  collectMsg: { fontSize: 12, fontWeight: '900', marginTop: 10, letterSpacing: 0.5 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 15 }
});