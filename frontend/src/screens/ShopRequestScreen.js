import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function ShopRequestScreen({ route, navigation }) {
  const { book } = route.params;
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await api.post('/shop-requests', {
        bookId: book._id,
        shopId: book.owner._id,
        price: book.price
      });
      Alert.alert('Success', `Your request for "${book.title}" has been sent to ${book.owner.shopName}.`, [
        { text: 'OK', onPress: () => navigation.popToTop() }
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Confirm Purchase Request</Text>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>BOOK DETAILS</Text>
          <Text style={[styles.bookTitle, { color: theme.text }]}>{book.title}</Text>
          <Text style={[styles.bookAuthor, { color: theme.muted }]}>{book.author}</Text>
          <Text style={[styles.price, { color: theme.success }]}>Price: ₹{book.price}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>SHOP DETAILS</Text>
          <Text style={[styles.info, { color: theme.text }]}>{book.owner.shopName}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>📍 {book.owner.shopAddress || book.owner.location}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>📞 {book.owner.phone}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>STUDENT DETAILS</Text>
          <Text style={[styles.info, { color: theme.text }]}>{user.name}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>{user.email}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>{user.phone}</Text>
        </GlassCard>

        <View style={styles.actions}>
          <AppButton
            title={loading ? "SENDING..." : "SUBMIT SHOP REQUEST"}
            onPress={handleSubmit}
            loading={loading}
          />
          <AppButton
            title="CANCEL"
            variant="dark"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 10 }}
          />
        </View>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 50 },
  title: { fontSize: 22, fontWeight: '900', marginBottom: 20, textAlign: 'center', marginTop: 20 },
  card: { padding: 16, marginVertical: 10 },
  sectionHeader: { fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  bookTitle: { fontSize: 18, fontWeight: '800' },
  bookAuthor: { fontSize: 14, marginTop: 4 },
  price: { fontSize: 20, fontWeight: '900', marginTop: 8 },
  info: { fontSize: 15, marginTop: 4, fontWeight: '600' },
  actions: { marginTop: 20 }
});