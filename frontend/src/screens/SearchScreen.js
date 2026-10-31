import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import { ListSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useThemeMode } from '../context/ThemeContext';
import api from '../api/client';

export default function SearchScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Animations
  const searchBarScale = useRef(new Animated.Value(1)).current;

  async function handleSearch() {
    if (!query.trim()) {
      showToast('Please enter a search keyword.', 'info');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/search/books?q=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } catch (error) {
      showToast('Search request failed. Check server connection.', 'error');
    } finally {
      setLoading(false);
    }
  }

  const renderSourceBadge = (role) => {
    let bg = '#3b82f620';
    let text = '#3b82f6';
    let label = '🏛 LIBRARY';

    if (role === 'shop') {
      bg = '#f9731620';
      text = '#f97316';
      label = '🏪 BOOK SHOP';
    } else if (role === 'student' || role === 'user') {
      bg = '#10b98120';
      text = '#10b981';
      label = '👤 STUDENT PEER';
    }

    return (
      <View style={[styles.sourceBadge, { backgroundColor: bg }]}>
        <Text style={[styles.sourceBadgeText, { color: text }]}>{label}</Text>
      </View>
    );
  };

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Smart Search</Text>

        {/* Search Bar Input */}
        <Animated.View
          style={[
            styles.searchBox,
            {
              borderColor: theme.glassBorder,
              backgroundColor: theme.tabBg,
              transform: [{ scale: searchBarScale }],
            },
          ]}
        >
          <Text style={styles.searchIcon}>🔎</Text>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Search books, authors, ISBN..."
            placeholderTextColor={theme.muted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery('')}
              style={styles.clearBtn}
            >
              <Text style={{ color: theme.muted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            onPressIn={() => Animated.spring(searchBarScale, { toValue: 0.98, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(searchBarScale, { toValue: 1, friction: 6, useNativeDriver: true }).start()}
            onPress={handleSearch}
            style={[styles.searchBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.btnText}>FIND</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Skeleton Loader during fetch */}
        {loading ? (
          <View style={{ marginTop: 10 }}>
            <ListSkeleton count={4} />
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              searched ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyEmoji}>🔎</Text>
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>No Books Found</Text>
                  <Text style={[styles.emptySub, { color: theme.muted }]}>
                    Try searching with broader terms or keywords.
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyEmoji}>📚</Text>
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>Unified Campus Search</Text>
                  <Text style={[styles.emptySub, { color: theme.muted }]}>
                    Search across institutional libraries, local bookshops, and student peer listings.
                  </Text>
                </View>
              )
            }
            renderItem={({ item }) => (
              <GlassCard style={styles.bookCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={2}>
                      📚 {item.title}
                    </Text>
                    <Text style={[styles.bookAuthor, { color: theme.muted }]}>
                      Author: {item.author || 'Unknown Author'}
                    </Text>
                  </View>
                  {renderSourceBadge(item.owner?.role)}
                </View>

                <View style={[styles.sourceSection, { borderTopColor: theme.glassBorder }]}>
                  <Text style={[styles.sourceName, { color: theme.text }]}>
                    {item.owner?.libraryName || item.owner?.shopName || item.owner?.name || 'Verified Source'}
                  </Text>

                  {item.price ? (
                    <Text style={[styles.price, { color: theme.primary }]}>Price: ₹{item.price}</Text>
                  ) : null}

                  <Text style={[styles.location, { color: theme.muted }]}>
                    📍 {item.owner?.shopAddress || item.owner?.libraryAddress || item.owner?.location || item.location || 'Campus Region'}
                  </Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      activeOpacity={0.88}
                      style={[styles.requestBtn, { backgroundColor: theme.primary }]}
                      onPress={() => {
                        if (!item.owner || typeof item.owner === 'string') {
                          showToast('Source information is incomplete for this book.', 'info');
                          return;
                        }
                        if (item.owner.role === 'library') {
                          navigation.navigate('LibraryRequest', { book: item });
                        } else if (item.owner.role === 'shop') {
                          navigation.navigate('ShopRequest', { book: item });
                        } else {
                          if (item.listingType === 'exchange') {
                            navigation.navigate('InitiateExchange', { requestedBook: item });
                          } else {
                            navigation.navigate('BookDetails', { bookId: item._id });
                          }
                        }
                      }}
                    >
                      <Text style={styles.requestBtnText}>
                        {item.listingType === 'exchange' ? 'REQUEST EXCHANGE →' : 'REQUEST BOOK →'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.chatBtn, { borderColor: theme.primary }]}
                      onPress={() => {
                        if (!item.owner || typeof item.owner === 'string') return;
                        navigation.navigate('ChatDetail', {
                          userId: item.owner._id,
                          userName: item.owner.shopName || item.owner.libraryName || item.owner.name,
                          bookId: item._id,
                        });
                      }}
                    >
                      <Text style={[styles.chatBtnText, { color: theme.primary }]}>💬 CHAT</Text>
                    </TouchableOpacity>
                  </View>
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
  container: { flex: 1, padding: 18 },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 16, letterSpacing: -0.5 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    height: 54,
    paddingLeft: 14,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  input: { flex: 1, paddingVertical: 0, height: '100%', fontSize: 14, fontWeight: '600' },
  clearBtn: { padding: 8, marginRight: 4 },
  searchBtn: { width: 75, height: '100%', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  bookCard: { padding: 18, marginVertical: 8, borderRadius: 22 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bookTitle: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  bookAuthor: { fontSize: 13, marginTop: 4, fontWeight: '500' },
  sourceBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginLeft: 10 },
  sourceBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  sourceSection: { marginTop: 14, paddingTop: 12, borderTopWidth: 1.5 },
  sourceName: { fontSize: 15, fontWeight: '800' },
  price: { fontSize: 16, fontWeight: '900', marginTop: 4 },
  location: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  requestBtn: { flex: 1, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  requestBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  chatBtn: { width: 90, height: 46, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  chatBtnText: { fontSize: 12, fontWeight: '900' },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 50, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '900' },
  emptySub: { fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18, fontWeight: '500' },
});
