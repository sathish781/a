import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function ShopInventoryScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadInventory() {
    try {
      setLoading(true);
      const res = await api.get('/shops/my-inventory');
      setInventory(res.data || []);
    } catch (error) {
      console.log('Load inventory error:', error);
      Alert.alert('Error', 'Could not fetch inventory.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleDelete(id, title) {
    Alert.alert('Remove Book', `Are you sure you want to remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/shops/books/${id}`);
            loadInventory();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete book.');
          }
        },
      },
    ]);
  }

  if (loading && inventory.length === 0) {
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
        <AppHeader
          title="Inventory Manager"
          subtitle={`Managing ${inventory.length} books in your shop`}
          icon="📦"
        />

        <FlatList
          data={inventory}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          onRefresh={loadInventory}
          refreshing={loading}
          renderItem={({ item }) => (
            <GlassCard style={styles.card}>
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.author, { color: theme.muted }]}>{item.author}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: theme.primary }]}>₹{item.price}</Text>
                    <View style={[styles.badge, { backgroundColor: theme.backgroundTwo, borderColor: theme.glassBorder }]}>
                      <Text style={[styles.badgeText, { color: theme.primary }]}>{item.category}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actions}>
                   <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.glassBorder }]}
                    onPress={() => navigation.navigate('ShopPanel', { editBook: item })}
                   >
                     <Text style={[styles.actionText, { color: theme.primary }]}>Edit</Text>
                   </TouchableOpacity>
                   <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: theme.glassBorder, marginTop: 8 }]}
                    onPress={() => handleDelete(item._id, item.title)}
                   >
                     <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
                   </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: theme.muted }}>No books found in inventory.</Text>
            </View>
          }
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { padding: 16, marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800' },
  author: { fontSize: 13, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  price: { fontSize: 16, fontWeight: '900' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  actions: { marginLeft: 12 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: '700' },
  empty: { marginTop: 40, alignItems: 'center' },
});