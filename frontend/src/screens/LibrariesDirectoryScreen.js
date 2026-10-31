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

function LibraryCard({ library, theme, onViewBooks }) {
  return (
    <GlassCard style={styles.card}>
      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.mode === 'light' ? '#f1f5f9' : '#0d0b18', borderColor: theme.primary }]}>
          <Text style={styles.avatarIcon}>🏛️</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.libraryName, { color: theme.text }]} numberOfLines={1}>
            {library.libraryName}
          </Text>
          <View style={styles.statusBadge}>
            <View style={styles.greenDot} />
            <Text style={[styles.statusText, { color: theme.success || '#10b981' }]}>Verified Library</Text>
          </View>
        </View>
        <View style={[styles.bookCountBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.bookCountText}>{library.bookCount}</Text>
          <Text style={styles.bookCountLabel}>Books</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📍</Text>
        <Text style={[styles.infoText, { color: theme.muted }]} numberOfLines={2}>
          {library.libraryAddress}
        </Text>
      </View>

      {/* Contact */}
      {!!library.phone && (
        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`tel:${library.phone}`)}>
          <Text style={styles.infoIcon}>📞</Text>
          <Text style={[styles.infoText, { color: theme.primary }]}>{library.phone}</Text>
        </TouchableOpacity>
      )}

      {!!library.email && (
        <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL(`mailto:${library.email}`)}>
          <Text style={styles.infoIcon}>✉️</Text>
          <Text style={[styles.infoText, { color: theme.primary }]}>{library.email}</Text>
        </TouchableOpacity>
      )}

      {/* Location */}
      {!!library.location && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🗺️</Text>
          <Text style={[styles.infoText, { color: theme.muted }]}>{library.location}</Text>
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={[styles.viewBtn, { borderColor: theme.primary, backgroundColor: theme.mode === 'dark' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }]}
        onPress={() => onViewBooks(library)}
        activeOpacity={0.8}
      >
        <Text style={[styles.viewBtnText, { color: theme.primary }]}>📚  Browse {library.bookCount} Library Books</Text>
      </TouchableOpacity>
    </GlassCard>
  );
}

export default function LibrariesDirectoryScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLibraries();
  }, []);

  async function fetchLibraries() {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/stats/libraries');
      setLibraries(res.data);
    } catch (e) {
      setError('Could not load libraries. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function handleViewBooks(library) {
    navigation.navigate('Search', { libraryId: library._id, libraryName: library.libraryName });
  }

  const filtered = libraries.filter(l =>
    l.libraryName.toLowerCase().includes(search.toLowerCase()) ||
    l.libraryAddress.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <GlassScreen>
      <AppScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <GlassCard style={styles.header}>
          <View style={styles.headerRow}>
            <View style={[styles.headerIcon, { backgroundColor: theme.primary }]}>
              <Text style={{ fontSize: 26 }}>🏛️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.headerLabel, { color: theme.primary }]}>BOOKCONNECT DIRECTORY</Text>
              <Text style={[styles.headerTitle, { color: theme.text }]}>College Libraries</Text>
              <Text style={[styles.headerSub, { color: theme.muted }]}>
                {loading ? 'Loading...' : `${libraries.length} verified libraries available`}
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderColor: theme.glassBorder }]}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search libraries by name or location..."
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
            <Text style={[styles.loadingText, { color: theme.muted }]}>Loading library directory...</Text>
          </View>
        ) : error ? (
          <GlassCard style={styles.errorCard}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>⚠️</Text>
            <Text style={[styles.errorText, { color: theme.text }]}>Unable to load libraries</Text>
            <Text style={[styles.errorSub, { color: theme.muted }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryBtn, { backgroundColor: theme.primary }]}
              onPress={fetchLibraries}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </GlassCard>
        ) : filtered.length === 0 ? (
          <GlassCard style={styles.errorCard}>
            <Text style={{ fontSize: 40, textAlign: 'center' }}>🔎</Text>
            <Text style={[styles.errorText, { color: theme.text }]}>
              {search ? `No libraries matching "${search}"` : 'No libraries registered yet'}
            </Text>
            <Text style={[styles.errorSub, { color: theme.muted }]}>
              {search ? 'Try a different search term' : 'Libraries will appear here once registered.'}
            </Text>
          </GlassCard>
        ) : (
          filtered.map(library => (
            <LibraryCard
              key={library._id}
              library={library}
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
  libraryName: {
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
