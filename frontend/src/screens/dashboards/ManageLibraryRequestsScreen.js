import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function ManageLibraryRequestsScreen() {
  const { theme } = useThemeMode();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    try {
      setLoading(true);
      const res = await api.get('/library-requests/library');
      setRequests(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch requests.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function handleAction(id, action) {
    try {
      await api.patch(`/library-requests/${id}/${action}`);
      Alert.alert('Success', `Request ${action}ed.`);
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Action failed.');
    }
  }

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
        <AppHeader title="Borrow Requests" subtitle="Manage student book holds" icon="📌" />

        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          onRefresh={loadRequests}
          refreshing={loading}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>No pending requests.</Text>}
          renderItem={({ item }) => (
            <GlassCard style={styles.card}>
              <View style={styles.header}>
                <Text style={[styles.bookTitle, { color: theme.text }]}>{item.bookId?.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#f59e0b' }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.details}>
                <Text style={[styles.info, { color: theme.muted }]}>👤 Student: {item.studentId?.name}</Text>
                <Text style={[styles.info, { color: theme.muted }]}>📧 {item.studentId?.email}</Text>
                <Text style={[styles.info, { color: theme.muted }]}>📞 {item.studentId?.phone}</Text>
                <Text style={[styles.info, { color: theme.primary, fontWeight: '700', marginTop: 5 }]}>⏳ Requested for: {item.requestedDays} days</Text>
              </View>

              {item.status === 'PENDING' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: theme.success }]} onPress={() => handleAction(item._id, 'accept')}>
                    <Text style={styles.btnText}>ACCEPT</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, { backgroundColor: theme.danger }]} onPress={() => handleAction(item._id, 'reject')}>
                    <Text style={styles.btnText}>REJECT</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  bookTitle: { fontSize: 17, fontWeight: '900', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  details: { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
  info: { fontSize: 13, marginVertical: 1 },
  actions: { flexDirection: 'row', marginTop: 15, gap: 10 },
  btn: { flex: 1, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 15 }
});