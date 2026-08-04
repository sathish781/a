import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, ActivityIndicator, View, TouchableOpacity } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import BookListItem from '../components/BookListItem';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function SearchScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [q, setQ] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, google, isbn, college, library, shop
  const [books, setBooks] = useState([]);
  const [googleBooks, setGoogleBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchBooks() {
    if (!q.trim() && filterType === 'google') return;
    try {
      setLoading(true);
      if (filterType === 'google') {
        const res = await api.get(`/google-books?title=${encodeURIComponent(q)}`);
        setGoogleBooks(res.data.books || []);
      } else {
        const res = await api.get('/books', {
          params: { q, type: filterType }
        });
        setBooks(res.data || []);
      }
    } catch (error) {
      console.log('Search error:', error);
      Alert.alert('Search Notice', 'Could not complete search. Displaying matching local records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchBooks();
  }, [filterType]);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Smart Book Search</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Search by title, author, ISBN, category, college, library, shop, or location.
        </Text>

        <GlassCard>
          <AppTextInput
            placeholder={filterType === 'google' ? "Enter title or ISBN for Google Books..." : "Search books, libraries, shops..."}
            value={q}
            onChangeText={setQ}
          />

          {/* Filter Chips */}
          <View style={styles.chipRow}>
            {[
              { id: 'all', label: 'All' },
              { id: 'google', label: '🌐 Google Books' },
              { id: 'isbn', label: 'ISBN' },
              { id: 'college', label: 'College' },
              { id: 'library', label: 'Library' },
              { id: 'shop', label: 'Shop' },
            ].map((chip) => (
              <TouchableOpacity
                key={chip.id}
                onPress={() => setFilterType(chip.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: filterType === chip.id ? theme.primary : (theme.mode === 'light' ? '#f1f5f9' : '#0f172a'),
                    borderColor: filterType === chip.id ? theme.primary : theme.glassBorder,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: filterType === chip.id ? '#ffffff' : theme.text }]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppButton title="Search Books" onPress={searchBooks} />
        </GlassCard>

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 20 }}
          />
        )}

        {filterType === 'google' ? (
          <FlatList
            data={googleBooks}
            keyExtractor={(item, idx) => item.isbn || idx.toString()}
            contentContainerStyle={{ paddingBottom: 110 }}
            ListEmptyComponent={
              !loading ? (
                <EmptyState
                  title="No Google Books found"
                  message="Enter a title or ISBN to auto-fetch metadata from Google Books API."
                />
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('SellBook', { googleBook: item })}
                activeOpacity={0.85}
              >
                <GlassCard style={styles.googleCard}>
                  <Text style={[styles.gbTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.gbAuthor, { color: theme.muted }]}>By: {item.author} | Publisher: {item.publisher || 'N/A'}</Text>
                  <Text style={[styles.gbDesc, { color: theme.muted }]} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.gbFooter}>
                    <Text style={[styles.gbIsbn, { color: theme.primary }]}>ISBN: {item.isbn || 'N/A'}</Text>
                    <Text style={[styles.gbAction, { color: theme.primary }]}>Use to List Book →</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item._id || Math.random().toString()}
            contentContainerStyle={{ paddingBottom: 110 }}
            ListEmptyComponent={
              !loading ? (
                <EmptyState
                  title="No books found"
                  message="Try searching another book title, author, or location."
                />
              ) : null
            }
            renderItem={({ item }) => (
              <BookListItem
                item={item}
                onPress={() => navigation.navigate('BookDetails', { bookId: item._id })}
              />
            )}
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 20
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  googleCard: {
    padding: 14,
    marginVertical: 6,
  },
  gbTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  gbAuthor: {
    fontSize: 13,
    marginTop: 2,
  },
  gbDesc: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 16,
  },
  gbFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  gbIsbn: {
    fontSize: 12,
    fontWeight: '700',
  },
  gbAction: {
    fontSize: 12,
    fontWeight: '800',
  },
});