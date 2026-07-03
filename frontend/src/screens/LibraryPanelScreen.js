import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function LibraryPanelScreen() {
  const [libraries, setLibraries] = useState([]);

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
    category: '',
    subject: '',
    course: '',
    semester: '',
    examType: 'Academic',
    totalCopies: '1',
    availableCopies: '1',
    shelfNumber: ''
  });

  function setLibraryValue(key, value) {
    setLibraryForm({
      ...libraryForm,
      [key]: value
    });
  }

  function setBookValue(key, value) {
    setBookForm({
      ...bookForm,
      [key]: value
    });
  }

  async function loadLibraries() {
    try {
      const res = await api.get('/libraries');
      setLibraries(res.data);
    } catch (error) {
      Alert.alert('Error', 'Libraries loading failed');
    }
  }

  async function createLibrary() {
    try {
      await api.post('/libraries', libraryForm);

      Alert.alert('Success', 'Library created');
      setLibraryForm({
        name: '',
        address: '',
        contact: ''
      });

      loadLibraries();
    } catch (error) {
      Alert.alert('Error', 'Library creation failed');
    }
  }

  async function addLibraryBook() {
    try {
      await api.post('/library-books', {
        ...bookForm,
        totalCopies: Number(bookForm.totalCopies),
        availableCopies: Number(bookForm.availableCopies)
      });

      Alert.alert('Success', 'Library book added');
    } catch (error) {
      Alert.alert('Error', 'Failed to add library book');
    }
  }

  useEffect(() => {
    loadLibraries();
  }, []);

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Library Panel</Text>
        <Text style={styles.subtitle}>
          Add library and manage book availability.
        </Text>

        <GlassCard>
          <Text style={styles.sectionTitle}>Create Library</Text>

          <AppTextInput
            placeholder="Library Name"
            value={libraryForm.name}
            onChangeText={(v) => setLibraryValue('name', v)}
          />

          <AppTextInput
            placeholder="Address"
            value={libraryForm.address}
            onChangeText={(v) => setLibraryValue('address', v)}
          />

          <AppTextInput
            placeholder="Contact"
            value={libraryForm.contact}
            onChangeText={(v) => setLibraryValue('contact', v)}
          />

          <AppButton title="Create Library" onPress={createLibrary} />
        </GlassCard>

        <GlassCard>
          <Text style={styles.sectionTitle}>Existing Library IDs</Text>

          {libraries.map((item) => (
            <Text key={item._id} style={styles.idText}>
              {item._id} - {item.name}
            </Text>
          ))}
        </GlassCard>

        <GlassCard>
          <Text style={styles.sectionTitle}>Add Library Book</Text>

          <AppTextInput
            placeholder="Library ID"
            value={bookForm.libraryId}
            onChangeText={(v) => setBookValue('libraryId', v)}
          />

          <AppTextInput
            placeholder="Book Title"
            value={bookForm.title}
            onChangeText={(v) => setBookValue('title', v)}
          />

          <AppTextInput
            placeholder="Author"
            value={bookForm.author}
            onChangeText={(v) => setBookValue('author', v)}
          />

          <AppTextInput
            placeholder="ISBN"
            value={bookForm.isbn}
            onChangeText={(v) => setBookValue('isbn', v)}
          />

          <AppTextInput
            placeholder="Category"
            value={bookForm.category}
            onChangeText={(v) => setBookValue('category', v)}
          />

          <AppTextInput
            placeholder="Subject"
            value={bookForm.subject}
            onChangeText={(v) => setBookValue('subject', v)}
          />

          <AppTextInput
            placeholder="Course"
            value={bookForm.course}
            onChangeText={(v) => setBookValue('course', v)}
          />

          <AppTextInput
            placeholder="Semester"
            value={bookForm.semester}
            onChangeText={(v) => setBookValue('semester', v)}
          />

          <AppTextInput
            placeholder="Exam Type"
            value={bookForm.examType}
            onChangeText={(v) => setBookValue('examType', v)}
          />

          <AppTextInput
            placeholder="Total Copies"
            value={bookForm.totalCopies}
            keyboardType="number-pad"
            onChangeText={(v) => setBookValue('totalCopies', v)}
          />

          <AppTextInput
            placeholder="Available Copies"
            value={bookForm.availableCopies}
            keyboardType="number-pad"
            onChangeText={(v) => setBookValue('availableCopies', v)}
          />

          <AppTextInput
            placeholder="Shelf Number"
            value={bookForm.shelfNumber}
            onChangeText={(v) => setBookValue('shelfNumber', v)}
          />

          <AppButton title="Add Library Book" onPress={addLibraryBook} />
        </GlassCard>
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 100
  },
  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 14
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 10
  },
  idText: {
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 6
  }
});