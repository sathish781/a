import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';

import { useThemeMode } from '../context/ThemeContext';

export default function SellBookScreen({ route, navigation }) {
  const { theme } = useThemeMode();
  const googleBookParam = route?.params?.googleBook;
  const isDonationParam = route?.params?.isDonation || route?.params?.listingType === 'donate';

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fetchingGb, setFetchingGb] = useState(false);

  const [form, setForm] = useState({
    title: googleBookParam?.title || '',
    author: googleBookParam?.author || '',
    isbn: googleBookParam?.isbn || '',
    publisher: googleBookParam?.publisher || '',
    category: googleBookParam?.categories?.[0] || 'General',
    subject: '',
    course: '',
    semester: '',
    examType: 'Academic',
    description: googleBookParam?.description || '',
    price: '0',
    condition: 'Good',
    listingType: isDonationParam ? 'donate' : 'sell',
    imageUrl: googleBookParam?.cover || '',
    publishedDate: googleBookParam?.publishedDate || '',
    previewLink: googleBookParam?.previewLink || '',
  });

  function setValue(key, value) {
    setForm({
      ...form,
      [key]: value,
    });
  }

  async function fetchGoogleBooksData() {
    const query = form.isbn || form.title;
    if (!query.trim()) {
      Alert.alert('Google Books Lookup', 'Please enter a Book Title or ISBN to search.');
      return;
    }
    try {
      setFetchingGb(true);
      const res = await api.get(`/google-books?title=${encodeURIComponent(query)}`);
      const books = res.data.books || [];
      if (books.length > 0) {
        const gb = books[0];
        setForm((prev) => ({
          ...prev,
          title: gb.title || prev.title,
          author: gb.author || prev.author,
          isbn: gb.isbn || prev.isbn,
          publisher: gb.publisher || prev.publisher,
          category: gb.categories?.[0] || prev.category,
          description: gb.description || prev.description,
          imageUrl: gb.cover || prev.imageUrl,
          publishedDate: gb.publishedDate || prev.publishedDate,
          previewLink: gb.previewLink || prev.previewLink,
        }));
        Alert.alert('Auto-filled!', `Found "${gb.title}" by ${gb.author}. Review and edit fields before saving.`);
      } else {
        Alert.alert('No Match', 'No book details found on Google Books API for this title/ISBN.');
      }
    } catch (err) {
      console.log('GB Error:', err);
      Alert.alert('Notice', 'Could not fetch Google Books metadata. You can enter details manually.');
    } finally {
      setFetchingGb(false);
    }
  }

  async function openCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Needed', 'Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Needed', 'Gallery permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  async function uploadImageIfSelected() {
    if (!image) return '';

    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: 'book-photo.jpg',
      type: 'image/jpeg',
    });

    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.imageUrl;
  }

  async function submitBook() {
    try {
      if (!form.title.trim()) {
        Alert.alert('Missing Field', 'Book title is required.');
        return;
      }

      setUploading(true);
      const uploadedImageUrl = await uploadImageIfSelected();

      await api.post('/marketplace', {
        ...form,
        price: Number(form.price || 0),
        imageUrl: uploadedImageUrl || form.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
      });

      Alert.alert('Success', 'Book uploaded successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Book upload failed'
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Post a Book</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Fetch Google Books metadata or take a photo to list your book.
          </Text>
        </View>

        {/* Auto Fetch Card */}
        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>🌐 Auto-Fetch Metadata</Text>
          <Text style={[styles.helpText, { color: theme.muted }]}>Enter title or ISBN and tap below to auto-populate from Google Books API.</Text>
          <AppButton
            title={fetchingGb ? 'FETCHING DATA...' : 'AUTO-FETCH FROM GOOGLE BOOKS'}
            onPress={fetchGoogleBooksData}
            variant="dark"
            style={{ marginTop: 8 }}
          />
        </GlassCard>

        {/* Book Photo Card */}
        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Book Photo</Text>

          {image || form.imageUrl ? (
            <Image source={{ uri: image ? image.uri : form.imageUrl }} style={styles.preview} />
          ) : (
            <View style={[styles.emptyImage, { backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#090a14', borderColor: theme.glassBorder }]}>
              <Text style={styles.emptyIcon}>📸</Text>
              <Text style={[styles.emptyText, { color: theme.muted }]}>Tap to add book cover photo</Text>
            </View>
          )}

          <View style={styles.btnRow}>
            <AppButton title="TAKE PHOTO" onPress={openCamera} style={{ flex: 1, marginRight: 6 }} />
            <AppButton title="GALLERY" variant="dark" onPress={pickFromGallery} style={{ flex: 1, marginLeft: 6 }} />
          </View>
        </GlassCard>

        {/* Book Details Form */}
        <GlassCard style={styles.card}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Book Information</Text>

          <AppTextInput
            placeholder="Book Title"
            value={form.title}
            onChangeText={(v) => setValue('title', v)}
          />

          <AppTextInput
            placeholder="Author Name"
            value={form.author}
            onChangeText={(v) => setValue('author', v)}
          />

          <AppTextInput
            placeholder="ISBN Number"
            value={form.isbn}
            onChangeText={(v) => setValue('isbn', v)}
          />

          <AppTextInput
            placeholder="Publisher"
            value={form.publisher}
            onChangeText={(v) => setValue('publisher', v)}
          />

          <AppTextInput
            placeholder="Category (e.g. Engineering, Science)"
            value={form.category}
            onChangeText={(v) => setValue('category', v)}
          />

          <AppTextInput
            placeholder="Subject / Course"
            value={form.subject}
            onChangeText={(v) => setValue('subject', v)}
          />

          <Text style={[styles.helpText, { color: theme.muted }]}>Listing Type: sell / exchange / donate</Text>
          <AppTextInput
            placeholder="Listing Type"
            value={form.listingType}
            autoCapitalize="none"
            onChangeText={(v) => setValue('listingType', v)}
          />

          <AppTextInput
            placeholder="Price (₹)"
            value={form.price}
            keyboardType="number-pad"
            onChangeText={(v) => setValue('price', v)}
          />

          <Text style={[styles.helpText, { color: theme.muted }]}>Condition: New / Like New / Good / Fair</Text>
          <AppTextInput
            placeholder="Book Condition"
            value={form.condition}
            onChangeText={(v) => setValue('condition', v)}
          />

          <AppTextInput
            placeholder="Description"
            value={form.description}
            multiline
            onChangeText={(v) => setValue('description', v)}
          />

          <AppButton
            title={uploading ? 'UPLOADING...' : 'POST LISTING NOW'}
            onPress={submitBook}
            style={{ marginTop: 12 }}
          />
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    padding: 18,
    marginVertical: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 14,
  },
  emptyImage: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#090a14',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 0, 60, 0.35)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyText: {
    color: '#94a3b8',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
  },
  helpText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 2,
    fontWeight: '500',
  },
});