import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppHeader from '../../components/AppHeader';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { useThemeMode } from '../../context/ThemeContext';

export default function AdminMarketplaceScreen() {
  const { theme } = useThemeMode();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    try {
      setLoading(true);
      const res = await api.get('/marketplace');
      setListings(res.data);
    } catch (error) {
      Alert.alert('Error', 'Could not load listings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function removeListing(id) {
    Alert.alert('Confirm removal', 'Remove this listing from the marketplace?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'REMOVE', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/marketplace/${id}`);
          Alert.alert('Success', 'Listing removed.');
          loadListings();
        } catch (e) {
          Alert.alert('Error', 'Action failed');
        }
      }}
    ]);
  }

  const renderItem = ({ item }) => (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{item.book?.title}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>₹{item.price}</Text>
      </View>
      <Text style={[styles.info, { color: theme.muted }]}>Seller: {item.seller?.name}</Text>
      <TouchableOpacity style={styles.delBtn} onPress={() => removeListing(item._id)}>
        <Text style={[styles.delText, { color: theme.danger }]}>REMOVE LISTING</Text>
      </TouchableOpacity>
    </GlassCard>
  );

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader title="Marketplace Moderator" icon="🛒" />
        {loading ? <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} /> : (
          <FlatList
            data={listings}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={renderItem}
            ListEmptyComponent={<EmptyState title="No listings" message="Marketplace is empty." />}
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 18, marginVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '900', flex: 1, marginRight: 10 },
  price: { fontSize: 18, fontWeight: '900' },
  info: { fontSize: 13, marginTop: 5 },
  delBtn: { marginTop: 15, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  delText: { fontSize: 12, fontWeight: '800' }
});
