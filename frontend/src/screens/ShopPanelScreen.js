import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, View, TouchableOpacity } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function ShopPanelScreen({ route, navigation }) {
  const editBook = route?.params?.editBook;

  const [shops, setShops] = useState([]);
  const [myInventory, setMyInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bookForm, setBookForm] = useState({
    title: editBook?.title || '',
    author: editBook?.author || '',
    isbn: editBook?.isbn || '',
    category: editBook?.category || 'Academic',
    condition: editBook?.condition || 'Good',
    price: editBook?.price?.toString() || '',
    description: editBook?.description || '',
    publisher: editBook?.publisher || '',
  });

  useEffect(() => {
    if (editBook) {
      setBookForm({
        title: editBook.title,
        author: editBook.author,
        isbn: editBook.isbn,
        category: editBook.category,
        condition: editBook.condition,
        price: editBook.price?.toString(),
        description: editBook.description,
        publisher: editBook.publisher,
      });
    }
  }, [editBook]);

  function setBookValue(key, value) {
    setBookForm({
      ...bookForm,
      [key]: value,
    });
  }

  async function loadData() {
    setLoading(true);
    try {
      const [shopsRes, invRes] = await Promise.all([
        api.get('/shops').catch(() => ({ data: [] })),
        api.get('/shops/my-inventory').catch(() => ({ data: [] })),
      ]);
      setShops(shopsRes.data || []);
      setMyInventory(invRes.data || []);
    } catch (error) {
      console.log('Error loading shop panel data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addShopBook() {
    if (!bookForm.title.trim()) {
      Alert.alert('Validation Error', 'Book title is required.');
      return;
    }
    if (!bookForm.price || isNaN(Number(bookForm.price))) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    try {
      if (editBook) {
        await api.put(`/shops/books/${editBook._id}`, {
          ...bookForm,
          price: Number(bookForm.price),
        });
        Alert.alert('Success', 'Book updated successfully!');
        navigation.goBack();
      } else {
        await api.post('/shops/books', {
          ...bookForm,
          price: Number(bookForm.price),
          sourceType: 'shop'
        });
        Alert.alert('Success', 'Book added to your shop inventory!');
      }

      setBookForm({
        title: '',
        author: '',
        isbn: '',
        category: 'Academic',
        condition: 'Good',
        price: '',
        description: '',
        publisher: '',
      });

      loadData();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to process request.');
    }
  }

  async function deleteShopBook(id, title) {
    Alert.alert(
      'Remove Book',
      `Are you sure you want to remove "${title}" from inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/shops/books/${id}`);
              Alert.alert('Success', 'Book removed from inventory.');
              loadData();
            } catch (error) {
              Alert.alert('Error', 'Failed to remove book.');
            }
          },
        },
      ]
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{editBook ? 'Edit Book Details' : 'Shop Control Panel'}</Text>
        <Text style={styles.subtitle}>
          {editBook ? 'Update your listing information below.' : 'Manage store inventory, list new titles, and track stock listings.'}
        </Text>

        {/* SECTION 1: ADD/EDIT BOOK */}
        <GlassCard>
          <Text style={styles.sectionTitle}>
            {editBook ? '📝 Update Book Information' : '➕ Add Book to Shop Inventory'}
          </Text>

          <AppTextInput
            placeholder="Book Title *"
            value={bookForm.title}
            onChangeText={(v) => setBookValue('title', v)}
          />

          <AppTextInput
            placeholder="Author"
            value={bookForm.author}
            onChangeText={(v) => setBookValue('author', v)}
          />

          <AppTextInput
            placeholder="Price (₹) *"
            value={bookForm.price}
            keyboardType="number-pad"
            onChangeText={(v) => setBookValue('price', v)}
          />

          <AppTextInput
            placeholder="ISBN"
            value={bookForm.isbn}
            onChangeText={(v) => setBookValue('isbn', v)}
          />

          <AppTextInput
            placeholder="Category (e.g. Computer Science, Novel)"
            value={bookForm.category}
            onChangeText={(v) => setBookValue('category', v)}
          />

          <AppTextInput
            placeholder="Condition (e.g. New, Like New, Good)"
            value={bookForm.condition}
            onChangeText={(v) => setBookValue('condition', v)}
          />

          <AppTextInput
            placeholder="Publisher (Optional)"
            value={bookForm.publisher}
            onChangeText={(v) => setBookValue('publisher', v)}
          />

          <AppTextInput
            placeholder="Description / Edition Notes"
            value={bookForm.description}
            multiline
            onChangeText={(v) => setBookValue('description', v)}
          />

          <AppButton title={editBook ? "Update Book Entry" : "Add to Shop Inventory"} onPress={addShopBook} />
        </GlassCard>

        {/* SECTION 2: MY SHOP INVENTORY (Hidden when editing) */}
        {!editBook && (
          <GlassCard>
            <Text style={styles.sectionTitle}>📦 My Current Stock ({myInventory.length})</Text>

            {myInventory.length === 0 ? (
              <Text style={styles.emptyText}>No books listed in your shop inventory yet.</Text>
            ) : (
              myInventory.map((item) => (
                <View key={item._id} style={styles.inventoryItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemMeta}>
                      by {item.author || 'Unknown'} • ₹{item.price} • {item.condition || 'Good'}
                    </Text>
                    {item.category ? (
                      <Text style={styles.itemSubmeta}>Category: {item.category}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => deleteShopBook(item._id, item.title)}
                    style={styles.deleteBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </GlassCard>
        )}

        {/* SECTION 3: REGISTERED CAMPUS BOOKSTORES */}
        <GlassCard>
          <Text style={styles.sectionTitle}>🏪 Registered Campus Bookstores</Text>

          {shops.length === 0 ? (
            <Text style={styles.emptyText}>No active bookstores registered yet.</Text>
          ) : (
            shops.map((shop) => (
              <View key={shop._id} style={styles.shopItem}>
                <Text style={styles.shopName}>{shop.shopName || shop.name}</Text>
                <Text style={styles.shopAddress}>📍 {shop.shopAddress || shop.location || 'Main Campus'}</Text>
                {shop.phone ? <Text style={styles.shopPhone}>📞 {shop.phone}</Text> : null}
              </View>
            ))
          )}
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
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  itemMeta: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  itemSubmeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  shopItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  shopName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  shopAddress: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  shopPhone: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});