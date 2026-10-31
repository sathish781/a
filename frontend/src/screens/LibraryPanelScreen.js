import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function LibraryPanelScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [libraryForm, setLibraryForm] = useState({
    name: '',
    address: '',
    contact: ''
  });

  const [bookForm, setBookForm] = useState({
    libraryId: '',
    title: '',
    author: '',
    isbn: '',
    category: 'Academic',
    description: '',
    condition: 'Good',
    totalCopies: '1',
    availableCopies: '1',
    shelfNumber: ''
  });

  async function loadLibraries() {
    try {
      setLoading(true);
      const res = await api.get('/libraries');
      setLibraries(res.data);
    } catch (error) {
      Alert.alert('Error', 'Libraries loading failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) loadLibraries();
  }, [isAdmin]);

  async function createLibrary() {
    try {
      await api.post('/libraries', libraryForm);
      Alert.alert('Success', 'Library created');
      setLibraryForm({ name: '', address: '', contact: '' });
      loadLibraries();
    } catch (error) {
      Alert.alert('Error', 'Library creation failed');
    }
  }

  async function addLibraryBook() {
    try {
      if (!bookForm.title.trim()) return Alert.alert('Error', 'Title is required');

      await api.post('/library-books', {
        ...bookForm,
        totalCopies: Number(bookForm.totalCopies),
        availableCopies: Number(bookForm.availableCopies)
      });

      Alert.alert('Success', 'Library book added');
      setBookForm({ ...bookForm, title: '', author: '', isbn: '' });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add library book');
    }
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Add New Book</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Register new arrivals into the library catalog.</Text>

        <GlassCard>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Book Information</Text>
          {isAdmin && (
            <AppTextInput
              placeholder="Library ID (Required for Admin)"
              value={bookForm.libraryId}
              onChangeText={(v) => setBookForm({...bookForm, libraryId: v})}
            />
          )}
          <AppTextInput placeholder="Book Title *" value={bookForm.title} onChangeText={(v) => setBookForm({...bookForm, title: v})} />
          <AppTextInput placeholder="Author" value={bookForm.author} onChangeText={(v) => setBookForm({...bookForm, author: v})} />
          <AppTextInput placeholder="ISBN" value={bookForm.isbn} onChangeText={(v) => setBookForm({...bookForm, isbn: v})} />
          <AppTextInput placeholder="Shelf Number" value={bookForm.shelfNumber} onChangeText={(v) => setBookForm({...bookForm, shelfNumber: v})} />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.label, { color: theme.muted }]}>Total Copies</Text>
              <AppTextInput placeholder="Total" value={bookForm.totalCopies} keyboardType="number-pad" onChangeText={(v) => setBookForm({...bookForm, totalCopies: v})} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: theme.muted }]}>Available</Text>
              <AppTextInput placeholder="Available" value={bookForm.availableCopies} keyboardType="number-pad" onChangeText={(v) => setBookForm({...bookForm, availableCopies: v})} />
            </View>
          </View>

          <AppButton title="ADD TO CATALOG" onPress={addLibraryBook} style={{ marginTop: 10 }} />
          <AppButton title="CANCEL" variant="dark" onPress={() => navigation.goBack()} style={{ marginTop: 8 }} />
        </GlassCard>

        {isAdmin && (
          <View style={{ marginTop: 30 }}>
            <GlassCard>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>🛡️ Admin: Create Library</Text>
              <AppTextInput placeholder="Library Name" value={libraryForm.name} onChangeText={(v) => setLibraryForm({...libraryForm, name: v})} />
              <AppTextInput placeholder="Address" value={libraryForm.address} onChangeText={(v) => setLibraryForm({...libraryForm, address: v})} />
              <AppTextInput placeholder="Contact" value={libraryForm.contact} onChangeText={(v) => setLibraryForm({...libraryForm, contact: v})} />
              <AppButton title="Create Library Account" onPress={createLibrary} />
            </GlassCard>
          </View>
        )}
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 15 },
  row: { flexDirection: 'row' },
  label: { fontSize: 12, marginBottom: 4, fontWeight: '700' },
});