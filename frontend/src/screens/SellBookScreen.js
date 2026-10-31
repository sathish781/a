import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, Alert, Image, View, Modal, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

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
  const isExchangeParam = route?.params?.listingType === 'exchange';

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fetchingGb, setFetchingGb] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

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
    price: isDonationParam || isExchangeParam ? '0' : '0',
    condition: 'Good',
    listingType: isDonationParam ? 'donate' : isExchangeParam ? 'exchange' : 'sell',
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

  async function fetchGoogleBooksData(isbnQuery = null) {
    const query = isbnQuery || form.isbn || form.title;
    if (!query || !query.trim()) {
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
        if (isbnQuery) {
          Alert.alert('Scan Success!', `Found details for "${gb.title}".`);
        } else {
          Alert.alert('Auto-filled!', `Found "${gb.title}" by ${gb.author}. Review and edit fields before saving.`);
        }
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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannerVisible(false);
    // ISBNs are usually EAN_13
    setValue('isbn', data);
    fetchGoogleBooksData(data);
  };

  async function openScanner() {
    if (!permission || !permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert('Permission needed', 'Allow camera access to scan barcodes.');
        return;
      }
    }
    setScanned(false);
    setScannerVisible(true);
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
          <Text style={[styles.helpText, { color: theme.muted }]}>Enter title, ISBN or use the barcode scanner.</Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <AppButton
              title={fetchingGb ? '...' : 'AUTO-FILL'}
              onPress={() => fetchGoogleBooksData()}
              variant="dark"
              style={{ flex: 1 }}
            />
            <AppButton
              title="📷 SCAN BARCODE"
              onPress={openScanner}
              variant="gold"
              style={{ flex: 1.5 }}
            />
          </View>
        </GlassCard>

        {/* Barcode Scanner Modal */}
        <Modal visible={scannerVisible} animationType="slide">
          <View style={styles.scannerContainer}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
              }}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerTarget} />
              <Text style={styles.scannerText}>Align ISBN barcode inside the box</Text>
              <TouchableOpacity style={styles.closeScanner} onPress={() => setScannerVisible(false)}>
                <Text style={styles.closeScannerText}>CANCEL SCAN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerTarget: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: '#fff',
    marginTop: 20,
    fontWeight: '700',
    fontSize: 14,
  },
  closeScanner: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeScannerText: {
    color: '#fff',
    fontWeight: '900',
  },
});