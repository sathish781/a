import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import AppButton from '../../components/AppButton';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function LibraryInventoryScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCatalog() {
    try {
      setLoading(true);
      const res = await api.get('/libraries/my-catalog');
      setCatalog(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load library catalog');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  async function updateAvailability(bookId, change) {
    try {
      const book = catalog.find(b => b._id === bookId);
      const newCount = Math.max(0, (book.availableCopies || 0) + change);

      await api.put(`/libraries/books/${bookId}`, {
        availableCopies: newCount
      });

      // Update local state for instant UI feedback
      setCatalog(prev => prev.map(b =>
        b._id === bookId ? { ...b, availableCopies: newCount } : b
      ));
    } catch (error) {
      Alert.alert('Error', 'Failed to update count');
    }
  }

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader
          title="Library Catalog"
          subtitle="Update book availability and stock"
          icon="📚"
        />

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
        ) : (
          <>
            <FlatList
              data={catalog}
              keyExtractor={(item) => item._id}
              onRefresh={loadCatalog}
              refreshing={loading}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text style={[styles.empty, { color: theme.muted }]}>No books found in catalog.</Text>
              }
              renderItem={({ item }) => (
                <GlassCard style={styles.card}>
                  <View style={styles.info}>
                    <Text style={[styles.bookTitle, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.bookAuthor, { color: theme.muted }]}>by {item.author}</Text>
                    <Text style={[styles.shelf, { color: theme.muted }]}>📍 Shelf: {item.shelfNumber || 'Not set'}</Text>
                    <Text style={[styles.count, { color: theme.primary }]}>Available: {item.availableCopies} / {item.totalCopies || 1}</Text>
                  </View>

                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => updateAvailability(item._id, 1)}
                      style={[styles.btn, { backgroundColor: theme.primary }]}
                    >
                      <Text style={styles.btnText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateAvailability(item._id, -1)}
                      style={[styles.btn, { backgroundColor: theme.backgroundThree }]}
                    >
                      <Text style={styles.btnText}>-</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              )}
            />
            <AppButton
              title="➕ ADD NEW BOOK TO CATALOG"
              variant="dark"
              onPress={() => navigation.navigate('LibraryPanel')}
              style={{ marginBottom: 40 }}
            />
          </>
        )}

      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', padding: 16, marginVertical: 8, alignItems: 'center' },
  info: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: '800' },
  bookAuthor: { fontSize: 12, marginTop: 2 },
  shelf: { fontSize: 11, marginTop: 4 },
  count: { fontSize: 13, fontWeight: '900', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginLeft: 15 },
  btn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  empty: { textAlign: 'center', marginTop: 100, fontSize: 15 }
});