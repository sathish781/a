import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, ActivityIndicator, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import BookListItem from '../components/BookListItem';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function SearchScreen({ navigation }) {
  const [q, setQ] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function searchBooks() {
    try {
      setLoading(true);

      const res = await api.get('/books', {
        params: { q }
      });

      setBooks(res.data);
    } catch (error) {
      Alert.alert('Error', 'Book search failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchBooks();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Smart Book Search</Text>
        <Text style={styles.subtitle}>
          Search by title, author, ISBN, subject, course, semester, or exam.
        </Text>

        <GlassCard>
          <AppTextInput
            placeholder="Search books..."
            value={q}
            onChangeText={setQ}
          />

          <AppButton title="Search" onPress={searchBooks} />
        </GlassCard>

        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 20 }}
          />
        )}

        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title="No books found"
                message="Try searching another book name or exam type."
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
    color: colors.white,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 12,
    lineHeight: 21
  }
});