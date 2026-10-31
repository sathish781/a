import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function LibraryRequestScreen({ route, navigation }) {
  const { book } = route.params;
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);

  const durationOptions = [1, 3, 7, 14, 30];

  async function handleSubmit() {
    setLoading(true);
    try {
      await api.post('/library-requests', {
        bookId: book._id,
        libraryId: book.owner._id,
        requestedDays: selectedDays
      });
      Alert.alert('Success', `Borrow request for "${book.title}" sent to ${book.owner.libraryName}.`, [
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
        <Text style={[styles.title, { color: theme.text }]}>Library Borrow Request</Text>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>BOOK & LIBRARY</Text>
          <Text style={[styles.bookTitle, { color: theme.text }]}>📚 {book.title}</Text>
          <Text style={[styles.info, { color: theme.text, marginTop: 10 }]}>🏛 {book.owner.libraryName}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>📍 {book.owner.libraryAddress || book.owner.location}</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>BORROW DURATION</Text>
          <Text style={[styles.label, { color: theme.muted }]}>How many days do you want this book?</Text>

          <View style={styles.optionsRow}>
            {durationOptions.map(day => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayChip,
                  { borderColor: theme.glassBorder },
                  selectedDays === day && { backgroundColor: theme.primary, borderColor: theme.primary }
                ]}
                onPress={() => setSelectedDays(day)}
              >
                <Text style={[
                  styles.dayText,
                  { color: theme.text },
                  selectedDays === day && { color: '#fff' }
                ]}>{day}d</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionHeader, { color: theme.primary }]}>STUDENT DETAILS</Text>
          <Text style={[styles.info, { color: theme.text }]}>{user.name}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>{user.email}</Text>
          <Text style={[styles.info, { color: theme.muted }]}>{user.phone}</Text>
        </GlassCard>

        <View style={styles.actions}>
          <AppButton
            title={loading ? "SUBMITTING..." : "SUBMIT LIBRARY REQUEST"}
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
  info: { fontSize: 15, marginTop: 2, fontWeight: '600' },
  label: { fontSize: 13, marginBottom: 15 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayChip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, borderWidth: 1, minWidth: 55, alignItems: 'center' },
  dayText: { fontWeight: 'bold', fontSize: 14 },
  actions: { marginTop: 20 }
});