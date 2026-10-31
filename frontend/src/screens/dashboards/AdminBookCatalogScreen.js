import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function AdminBookCatalogScreen() {
  const { theme } = useThemeMode();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBooks() {
    try {
      setLoading(true);
      const res = await api.get('/admin/books');
      setBooks(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load global catalog');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function deleteBook(id) {
    Alert.alert('Confirm Delete', 'Permanently remove this book from the entire platform?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'DELETE', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/admin/books/${id}`);
          Alert.alert('Deleted', 'Book has been removed.');
          loadBooks();
        } catch (e) {
          Alert.alert('Error', 'Deletion failed.');
        }
      }}
    ]);
  }

  const renderItem = ({ item }) => (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' }}
          style={styles.img}
        />
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.author, { color: theme.muted }]}>by {item.author}</Text>
          <View style={styles.meta}>
            <Text style={[styles.owner, { color: theme.primary }]}>👤 {item.owner?.name || 'Unknown'}</Text>
            <Text style={[styles.role, { color: theme.muted }]}>({item.role})</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.delBtn} onPress={() => deleteBook(item._id)}>
          <Text style={{ fontSize: 18 }}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.text }]}>Platform Catalog</Text>
        <Text style={[styles.sub, { color: theme.muted }]}>Total titles: {books.length}</Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={books}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            onRefresh={loadBooks}
            refreshing={loading}
            ListEmptyComponent={<EmptyState title="Catalog Empty" message="No books found on platform." />}
            renderItem={renderItem}
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: '900' },
  sub: { fontSize: 13, marginBottom: 15 },
  card: { padding: 12, marginVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  img: { width: 50, height: 70, borderRadius: 8 },
  info: { flex: 1, marginLeft: 15 },
  title: { fontSize: 16, fontWeight: '800' },
  author: { fontSize: 13, marginTop: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 5 },
  owner: { fontSize: 11, fontWeight: '700' },
  role: { fontSize: 10, fontWeight: '500' },
  delBtn: { padding: 10 }
});
