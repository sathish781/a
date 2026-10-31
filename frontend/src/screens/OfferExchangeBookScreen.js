import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, Image, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function OfferExchangeBookScreen({ navigation }) {
  const { theme } = useThemeMode();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingGb, setFetchingGb] = useState(false);

  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Academic',
    description: '',
    condition: 'Good',
    listingType: 'exchange', // Fixed to exchange
    price: '0', // No price for exchange
    imageUrl: '',
  });

  function setValue(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function fetchGoogleBooksData() {
    const query = form.isbn || form.title;
    if (!query.trim()) {
      Alert.alert('Lookup', 'Please enter a Book Title or ISBN.');
      return;
    }
    try {
      setFetchingGb(true);
      const res = await api.get(`/google-books?title=${encodeURIComponent(query)}`);
      const books = res.data.books || [];
      if (books.length > 0) {
        const gb = books[0];
        setForm(prev => ({
          ...prev,
          title: gb.title || prev.title,
          author: gb.author || prev.author,
          isbn: gb.isbn || prev.isbn,
          category: gb.categories?.[0] || prev.category,
          description: gb.description || prev.description,
          imageUrl: gb.cover || prev.imageUrl,
        }));
        Alert.alert('Success', `Found metadata for "${gb.title}".`);
      } else {
        Alert.alert('Not Found', 'Could not find details for this book.');
      }
    } catch (err) {
      Alert.alert('Notice', 'Manual entry required.');
    } finally {
      setFetchingGb(false);
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed');

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  async function submitOffer() {
    if (!form.title.trim()) return Alert.alert('Required', 'Book title is missing.');

    setLoading(true);
    try {
      let finalImageUrl = form.imageUrl;

      if (image) {
        const formData = new FormData();
        formData.append('image', {
          uri: image.uri,
          name: 'offer.jpg',
          type: 'image/jpeg',
        });
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalImageUrl = uploadRes.data.imageUrl;
      }

      await api.post('/marketplace', {
        ...form,
        imageUrl: finalImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      });

      Alert.alert('Listed!', 'Your book is now available for exchange.', [
        { text: 'OK', onPress: () => navigation.navigate('Exchange', { initialTab: 'mylistings' }) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Could not list book.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Offer Book for Exchange</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>List your book to start swapping with other students.</Text>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🌐 Auto-Fetch Details</Text>
          <AppTextInput
             placeholder="ISBN or Title"
             value={form.isbn || form.title}
             onChangeText={v => setValue('title', v)}
          />
          <AppButton
            title={fetchingGb ? "FETCHING..." : "AUTO-FILL FROM GOOGLE"}
            variant="dark"
            onPress={fetchGoogleBooksData}
          />
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Book Cover</Text>
          <TouchableOpacity onPress={pickImage}>
            {image || form.imageUrl ? (
              <Image source={{ uri: image ? image.uri : form.imageUrl }} style={styles.preview} />
            ) : (
              <View style={[styles.emptyImage, { borderColor: theme.glassBorder }]}>
                <Text style={{ fontSize: 40 }}>📸</Text>
                <Text style={{ color: theme.muted, marginTop: 8 }}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Manual Information</Text>
          <AppTextInput placeholder="Book Title *" value={form.title} onChangeText={v => setValue('title', v)} />
          <AppTextInput placeholder="Author" value={form.author} onChangeText={v => setValue('author', v)} />
          <AppTextInput placeholder="Category" value={form.category} onChangeText={v => setValue('category', v)} />

          <Text style={[styles.label, { color: theme.muted }]}>Condition</Text>
          <View style={styles.row}>
            {['New', 'Good', 'Fair'].map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setValue('condition', c)}
                style={[styles.chip, form.condition === c && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              >
                <Text style={[styles.chipText, { color: form.condition === c ? '#fff' : theme.text }]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <AppTextInput placeholder="Description" value={form.description} multiline onChangeText={v => setValue('description', v)} />

          <AppButton
            title={loading ? "LISTING..." : "POST FOR EXCHANGE"}
            onPress={submitOffer}
            loading={loading}
            style={{ marginTop: 20 }}
          />
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '900' },
  subtitle: { fontSize: 13, marginTop: 4, marginBottom: 20 },
  card: { padding: 16, marginVertical: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  preview: { width: '100%', height: 180, borderRadius: 12 },
  emptyImage: { height: 150, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 10 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  chip: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  chipText: { fontSize: 12, fontWeight: '700' }
});