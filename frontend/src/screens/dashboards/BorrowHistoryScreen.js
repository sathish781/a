import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function BorrowHistoryScreen() {
  const { theme } = useThemeMode();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      setLoading(true);
      const res = await api.get('/library-requests/student');
      setRequests(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch borrow history.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function getRemainingDays(dueDate) {
    if (!dueDate) return null;
    const diff = new Date(dueDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
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
        <AppHeader title="Borrow History" subtitle="Your library hold & loan records" icon="⏳" />

        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          onRefresh={loadHistory}
          refreshing={loading}
          ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>No borrow records found.</Text>}
          renderItem={({ item }) => {
            const daysLeft = getRemainingDays(item.dueDate);
            const isOverdue = item.status === 'BORROWED' && daysLeft === 0;

            return (
              <GlassCard style={styles.card}>
                <View style={styles.header}>
                  <Text style={[styles.bookTitle, { color: theme.text }]}>{item.bookId?.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: item.status === 'APPROVED' || item.status === 'BORROWED' ? theme.success : item.status === 'REJECTED' ? theme.danger : '#f59e0b' }
                  ]}>
                    <Text style={styles.statusText}>{isOverdue ? 'OVERDUE' : item.status}</Text>
                  </View>
                </View>

                <View style={styles.details}>
                  <Text style={[styles.info, { color: theme.muted }]}>🏛 Library: {item.libraryId?.libraryName || item.libraryId?.name}</Text>
                  {item.borrowDate && <Text style={[styles.info, { color: theme.muted }]}>📅 Borrowed: {new Date(item.borrowDate).toLocaleDateString()}</Text>}
                  {item.dueDate && <Text style={[styles.info, { color: theme.muted }]}>⌛ Due Date: {new Date(item.dueDate).toLocaleDateString()}</Text>}

                  {item.status === 'BORROWED' && daysLeft !== null && (
                    <Text style={[styles.info, { color: isOverdue ? theme.danger : theme.primary, fontWeight: '700', marginTop: 5 }]}>
                      {isOverdue ? 'PLEASE RETURN ASAP' : `${daysLeft} Days Remaining`}
                    </Text>
                  )}
                </View>
              </GlassCard>
            );
          }}
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
  empty: { textAlign: 'center', marginTop: 50, fontSize: 15 }
});