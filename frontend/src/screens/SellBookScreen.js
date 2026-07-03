import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function SellBookScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    subject: '',
    course: '',
    semester: '',
    examType: 'Academic',
    description: '',
    price: '0',
    condition: 'Good',
    listingType: 'sell',
    imageUrl: '',
  });

  function setValue(key, value) {
    setForm({
      ...form,
      [key]: value,
    });
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
    if (!image) {
      return '';
    }

    const formData = new FormData();

    formData.append('image', {
      uri: image.uri,
      name: 'book-photo.jpg',
      type: 'image/jpeg',
    });

    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
        imageUrl: uploadedImageUrl || form.imageUrl,
      });

      Alert.alert('Success', 'Book uploaded successfully');
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
        <Text style={styles.title}>Upload Book</Text>
        <Text style={styles.subtitle}>
          Take photo, mention price, condition, and upload your book.
        </Text>

        <GlassCard>
          <Text style={styles.sectionTitle}>Book Photo</Text>

          {image ? (
            <Image source={{ uri: image.uri }} style={styles.preview} />
          ) : (
            <View style={styles.emptyImage}>
              <Text style={styles.emptyIcon}>📸</Text>
              <Text style={styles.emptyText}>No photo selected</Text>
            </View>
          )}

          <AppButton title="Take Photo" onPress={openCamera} />
          <AppButton title="Choose From Gallery" variant="dark" onPress={pickFromGallery} />
        </GlassCard>

        <GlassCard>
          <Text style={styles.sectionTitle}>Book Details</Text>

          <AppTextInput
            placeholder="Book Title"
            value={form.title}
            onChangeText={(v) => setValue('title', v)}
          />

          <AppTextInput
            placeholder="Author"
            value={form.author}
            onChangeText={(v) => setValue('author', v)}
          />

          <AppTextInput
            placeholder="ISBN"
            value={form.isbn}
            onChangeText={(v) => setValue('isbn', v)}
          />

          <AppTextInput
            placeholder="Category"
            value={form.category}
            onChangeText={(v) => setValue('category', v)}
          />

          <AppTextInput
            placeholder="Subject"
            value={form.subject}
            onChangeText={(v) => setValue('subject', v)}
          />

          <AppTextInput
            placeholder="Course"
            value={form.course}
            onChangeText={(v) => setValue('course', v)}
          />

          <AppTextInput
            placeholder="Semester"
            value={form.semester}
            onChangeText={(v) => setValue('semester', v)}
          />

          <Text style={styles.help}>
            Exam Type: Academic / TNPSC / UPSC / SSC / Banking / Railway / NEET / JEE / GATE / TET
          </Text>

          <AppTextInput
            placeholder="Exam Type"
            value={form.examType}
            onChangeText={(v) => setValue('examType', v)}
          />

          <Text style={styles.help}>
            Listing Type: sell / exchange / donate
          </Text>

          <AppTextInput
            placeholder="Listing Type"
            value={form.listingType}
            autoCapitalize="none"
            onChangeText={(v) => setValue('listingType', v)}
          />

          <AppTextInput
            placeholder="Price"
            value={form.price}
            keyboardType="number-pad"
            onChangeText={(v) => setValue('price', v)}
          />

          <Text style={styles.help}>
            Condition: New / Good / Average / Old
          </Text>

          <AppTextInput
            placeholder="Condition"
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
            title={uploading ? 'Uploading...' : 'Submit Book'}
            onPress={submitBook}
          />
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 100,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 230,
    borderRadius: 22,
    marginBottom: 12,
  },
  emptyImage: {
    height: 210,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: colors.muted,
    marginTop: 8,
    fontWeight: '700',
  },
  help: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
});