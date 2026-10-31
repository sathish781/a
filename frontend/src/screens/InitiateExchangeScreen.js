import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function InitiateExchangeScreen({ route, navigation }) {
  const { theme } = useThemeMode();
  const { requestedBook } = route.params;

  const [myBooks, setMyBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function loadMyBooks() {
    try {
      setLoading(true);
      const res = await api.get('/books/my-books');
      // Only show books listed as 'exchange' or 'sell' that can be offered
      setMyBooks(res.data.filter(b => b.availability));
    } catch (error) {
      Alert.alert('Error', 'Could not load your books');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyBooks();
  }, []);

  async function handleRequest() {
    if (!selectedBookId) {
      Alert.alert('Selection Required', 'Please select one of your books to offer in exchange.');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/exchanges/request', {
        requestedBookId: requestedBook._id,
        offeredBookId: selectedBookId,
        message
      });
      Alert.alert('Success', 'Exchange request sent!', [
        { text: 'OK', onPress: () => navigation.navigate('Exchange') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Initiate Exchange</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Select one of your books to offer for this swap.</Text>

        <GlassCard style={styles.targetCard}>
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>REQUESTING</Text>
          <Text style={[styles.bookTitle, { color: theme.text }]}>{requestedBook.title}</Text>
          <Text style={[styles.bookAuthor, { color: theme.muted }]}>by {requestedBook.author}</Text>
          <Text style={[styles.owner, { color: theme.muted }]}>Owner: {requestedBook.owner?.name}</Text>
        </GlassCard>

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Books to Offer</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OfferExchangeBook')}>
            <Text style={[styles.addBtn, { color: theme.primary }]}>+ ADD NEW</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={myBooks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedBookId(item._id)}
                activeOpacity={0.8}
              >
                <GlassCard style={[
                  styles.bookItem,
                  selectedBookId === item._id && { borderColor: theme.primary, borderWidth: 2 }
                ]}>
                  <View style={styles.row}>
                    <View style={styles.info}>
                      <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                      <Text style={[styles.itemAuthor, { color: theme.muted }]}>{item.author}</Text>
                    </View>
                    {selectedBookId === item._id && (
                      <Text style={{ fontSize: 20 }}>✅</Text>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ color: theme.muted, textAlign: 'center', lineHeight: 20 }}>
                  You don't have any available books listed to offer in exchange. Add a book to your collection to offer for this swap!
                </Text>
                <AppButton
                  title="➕ ADD A BOOK TO OFFER NOW"
                  variant="gold"
                  onPress={() => navigation.navigate('OfferExchangeBook')}
                  style={{ marginTop: 15 }}
                />
              </View>
            }
            style={{ maxHeight: 300 }}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <AppTextInput
            placeholder="Add a message to the book owner (optional)"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <AppButton
            title={submitting ? "SENDING REQUEST..." : "🤝 SEND EXCHANGE REQUEST"}
            onPress={handleRequest}
            loading={submitting}
            disabled={!selectedBookId}
          />
        </View>
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 14, marginBottom: 20, marginTop: 4 },
  targetCard: { padding: 16, marginBottom: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 5 },
  bookTitle: { fontSize: 18, fontWeight: '800' },
  bookAuthor: { fontSize: 14, marginTop: 2 },
  owner: { fontSize: 12, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addBtn: { fontSize: 13, fontWeight: '900' },
  bookItem: { padding: 12, marginVertical: 5 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemTitle: { fontSize: 15, fontWeight: '700' },
  itemAuthor: { fontSize: 12 },
  empty: { padding: 30, alignItems: 'center' }
});