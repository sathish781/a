import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppScrollView from '../components/AppScrollView';
import { useThemeMode } from '../context/ThemeContext';
import api from '../api/client';

function ShopCard({ shop, theme, onViewBooks }) {
  return (
    <GlassCard style={styles.card}>
      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.mode === 'light' ? '#f1f5f9' : '#0d0b18', borderColor: theme.primary }]}>
          <Text style={styles.avatarIcon}>🏪</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.shopName, { color: theme.text }]} numberOfLines={1}>
            {shop.shopName}
          </Text>
          <View style={styles.statusBadge}>
            <View style={[styles.greenDot]} />
            <Text style={[styles.statusText, { color: theme.success || '#10b981' }]}>Open & Active</Text>
          </View>
        </View>
        <View style={[styles.bookCountBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.bookCountText}>{shop.bookCount}</Text>
          <Text style={styles.bookCountLabel}>Books</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📍</Text>
        <Text style={[styles.infoText, { color: theme.muted }]} numberOfLines={2}>
          {shop.shopAddress}
        </Text>
      </View>

      {/* Description */}
      {!!shop.businessDescription && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📝</Text>
          <Text style={[styles.infoText, { color: theme.muted }]} numberOfLines={2}>
            {shop.businessDescription}
          </Text>
        </View>
      )}

      {/* Contact */}
      {!!shop.phone && (
        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${shop.phone}`)}>
          <Text style={styles.infoIcon}>📞</Text>
          <Text style={[styles.infoText, { color: theme.primary }]}>{shop.phone}</Text>
        </TouchableOpacity>
      )}

      {!!shop.email && (
        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${shop.email}`)}>
          <Text style={styles.infoIcon}>✉️</Text>
          <Text style={[styles.infoText, { color: theme.primary }]}>{shop.email}</Text>
        </TouchableOpacity>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.viewBtn, { borderColor: theme.primary, backgroundColor: theme.mode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }]}
        onPress={() => onViewBooks(shop)}
        activeOpacity={0.8}
      >
        <Text style={[styles.viewBtnText, { color: theme.primary }]}>📚  Browse {shop.bookCount} Books</Text>
      </TouchableOpacity>
    </GlassCard>
  );
}

export default function ShopsDirectoryScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  async function fetchShops() {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/stats/shops');
      setShops(res.data);
    } catch (e) {
      setError('Could not load shops. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function handleViewBooks(shop) {
    navigation.navigate('Search', { shopId: shop._id, shopName: shop.shopName });
  }

  const filtered = shops.filter(s =>
    s.shopName.toLowerCase().includes(search.toLowerCase()) ||
    s.shopAddress.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <GlassCard style={styles.header}>
          <View style={styles.headerRow}>
            <View style={[styles.headerIcon, { backgroundColor: theme.primary }]}>
              <Text style={{ fontSize: 26 }}>🏪</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerLabel, { color: theme.primary }]}>BOOKCONNECT DIRECTORY</Text>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Local Book Shops</Text>
              <Text style={[styles.headerSub, { color: theme.muted }]}>
                {loading ? 'Loading...' : `${shops.length} verified shops available`}
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderColor: theme.glassBorder }]}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search shops by name or location..."
              placeholderTextColor={theme.muted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={{ color: theme.muted, fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </GlassCard>

        {/* Content */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.muted }]}>Loading shop directory...</Text>
          </View>
        ) : error ? (
          <GlassCard style={styles.errorCard}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>⚠️</Text>
            <Text style={[styles.errorText, { color: theme.text }]}>Unable to load shops</Text>
            <Text style={[styles.errorSub, { color: theme.muted }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryBtn, { backgroundColor: theme.primary }]}
              onPress={fetchShops}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : filtered.length === 0 ? (
          <GlassCard style={styles.errorCard}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>🔎</Text>
            <Text style={[styles.errorText, { color: theme.text }]}>
              {search ? `No shops matching "${search}"` : 'No shops registered yet'}
            </Text>
            <Text style={[styles.errorSub, { color: theme.muted }]}>
              {search ? 'Try a different search term' : 'Be the first to register your bookstore!'}
            </Text>
          </GlassCard>
        ) : (
          filtered.map(shop => (
            <ShopCard
              key={shop._id}
              shop={shop}
              theme={theme}
              onViewBooks={handleViewBooks}
            />
          ))
        )}
      </AppScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    padding: 18,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarIcon: {
    fontSize: 24,
  },
  shopName: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bookCountBadge: {
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    minWidth: 52,
  },
  bookCountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  bookCountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  viewBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
  },
  errorCard: {
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
    textAlign: 'center',
  },
  errorSub: {
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
