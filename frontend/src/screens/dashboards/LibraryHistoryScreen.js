import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function LibraryHistoryScreen() {
  const { theme } = useThemeMode();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    try {
      setLoading(true);
      const res = await api.get('/libraries/borrow-history');
      setHistory(res.data);
    } catch (error) {
      console.log('History load error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader
          title="Borrow History"
          subtitle="Record of all student book loans"
          icon="⏳"
        />

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item._id}
            onRefresh={loadHistory}
            refreshing={loading}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: theme.muted }]}>No borrow records found.</Text>
            }
            renderItem={({ item }) => (
              <GlassCard style={styles.card}>
                <Text style={[styles.bookTitle, { color: theme.text }]}>{item.book?.title || 'Unknown Book'}</Text>
                <View style={styles.details}>
                  <Text style={[styles.info, { color: theme.muted }]}>👤 Student: <Text style={{ color: theme.text, fontWeight: '700' }}>{item.student?.name}</Text></Text>
                  <Text style={[styles.info, { color: theme.muted }]}>📅 Borrowed: {new Date(item.borrowDate).toLocaleDateString()}</Text>
                  {item.returnDate && (
                    <Text style={[styles.info, { color: theme.muted }]}>✅ Returned: {new Date(item.returnDate).toLocaleDateString()}</Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.returnDate ? theme.success + '20' : '#f59e0b20' }]}>
                  <Text style={[styles.statusText, { color: item.returnDate ? theme.success : '#f59e0b' }]}>
                    {item.returnDate ? 'RETURNED' : 'CURRENTLY LOANED'}
                  </Text>
                </View>
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
  card: { padding: 16, marginVertical: 8 },
  bookTitle: { fontSize: 17, fontWeight: '900' },
  details: { marginTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
  info: { fontSize: 13, marginVertical: 2 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 12 },
  statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  empty: { textAlign: 'center', marginTop: 100, fontSize: 15 }
});