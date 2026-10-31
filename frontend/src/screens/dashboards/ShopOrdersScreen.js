import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';
import { useThemeMode } from '../../context/ThemeContext';
import api from '../../api/client';

export default function ShopOrdersScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      setLoading(true);
      const res = await api.get('/shop-requests/shop');
      setRequests(res.data || []);
    } catch (error) {
      console.log('Error fetching shop orders:', error);
      showToast('Could not fetch incoming customer orders.', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
    const unsubscribe = navigation.addListener('focus', () => {
      loadRequests();
    });
    return unsubscribe;
  }, [navigation]);

  async function handleAction(id, action) {
    try {
      await api.patch(`/shop-requests/${id}/${action}`);
      showToast(`Order ${action}ed successfully!`, 'success');
      loadRequests();
    } catch (error) {
      showToast(error.response?.data?.message || 'Action failed', 'error');
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'ACCEPTED':
        return theme.primary;
      case 'COMPLETED':
        return theme.success;
      case 'REJECTED':
        return theme.danger;
      default:
        return theme.muted;
    }
  };

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader
          title="Customer Orders"
          subtitle="Track and fulfill student book purchases"
          icon="🛒"
        />

        {loading && requests.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item._id}
            onRefresh={loadRequests}
            refreshing={loading}
            contentContainerStyle={{ paddingBottom: 110 }}
            ListEmptyComponent={
              <EmptyState
                title="No Incoming Orders"
                message="Student book purchase requests will appear here in real-time."
              />
            }
            renderItem={({ item }) => (
              <GlassCard style={styles.card}>
                <View style={styles.header}>
                  <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={1}>
                    {item.bookId?.title || 'Book Request'}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={[styles.details, { borderTopColor: theme.glassBorder }]}>
                  <Text style={[styles.info, { color: theme.text }]}>
                    👤 Buyer: {item.studentId?.name || 'Student'}
                  </Text>
                  {item.studentId?.email ? (
                    <Text style={[styles.info, { color: theme.muted }]}>
                      📧 {item.studentId?.email}
                    </Text>
                  ) : null}
                  {item.studentId?.phone ? (
                    <Text style={[styles.info, { color: theme.muted }]}>
                      📞 {item.studentId?.phone}
                    </Text>
                  ) : null}
                  <Text style={[styles.price, { color: theme.primary }]}>
                    Amount: ₹{item.price}
                  </Text>
                </View>

                {item.status === 'PENDING' && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: theme.primary }]}
                      onPress={() => handleAction(item._id, 'accept')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnText}>ACCEPT ORDER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: theme.danger }]}
                      onPress={() => handleAction(item._id, 'reject')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.btnText, { color: theme.danger }]}>REJECT</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === 'ACCEPTED' && (
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: theme.success, marginTop: 12 }]}
                    onPress={() => handleAction(item._id, 'complete')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnText}>MARK AS COLLECTED</Text>
                  </TouchableOpacity>
                )}
              </GlassCard>
            )}
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { padding: 16, marginVertical: 8, borderRadius: 22 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bookTitle: { fontSize: 17, fontWeight: '900', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  details: { marginTop: 10, borderTopWidth: 1, paddingTop: 10 },
  info: { fontSize: 13, marginVertical: 2, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: '900', marginTop: 6 },
  actions: { flexDirection: 'row', marginTop: 14, gap: 10 },
  btn: { flex: 1, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
});
