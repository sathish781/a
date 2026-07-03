import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, ActivityIndicator, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { colors } from '../utils/theme';

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export default function BookDetailsScreen({ route }) {
  const { bookId } = route.params;

  const [data, setData] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadDetails() {
    try {
      setLoading(true);

      const details = await api.get(`/books/${bookId}`);
      const priceRes = await api.get(`/books/${bookId}/prices`);

      setData(details.data);
      setPrices(priceRes.data);
    } catch (error) {
      Alert.alert('Error', 'Unable to load book details');
    } finally {
      setLoading(false);
    }
  }

  async function reserveLibrary(libraryBookId) {
    try {
      await api.post('/reservations', {
        sourceType: 'library',
        libraryBookId
      });

      Alert.alert('Success', 'Library book reserved successfully');
      loadDetails();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Reservation failed'
      );
    }
  }

  async function reserveShop(shopBookId) {
    try {
      await api.post('/reservations', {
        sourceType: 'shop',
        shopBookId
      });

      Alert.alert('Success', 'Shop book reserved successfully');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Reservation failed'
      );
    }
  }

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading || !data) {
    return (
      <GlassScreen>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <GlassCard>
          <Text style={styles.bookIcon}>📘</Text>
          <Text style={styles.title}>{data.book?.title}</Text>
          <Text style={styles.subtitle}>{data.book?.author}</Text>

          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{data.book?.examType || 'Academic'}</Text>
            <Text style={styles.badge}>{data.book?.category || 'Book'}</Text>
          </View>

          <Text style={styles.description}>
            {data.book?.description || 'No description available.'}
          </Text>
        </GlassCard>

        <SectionTitle>Price Comparison</SectionTitle>

        {prices.length === 0 ? (
          <EmptyState title="No price data" message="No sources available now." />
        ) : (
          prices.map((item, index) => (
            <GlassCard key={index}>
              <Text style={styles.cardTitle}>{item.source}</Text>
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.cardText}>Stock: {item.stock}</Text>
              <Text style={styles.cardText}>{item.note}</Text>
            </GlassCard>
          ))
        )}

        <SectionTitle>Library Availability</SectionTitle>

        {data.libraries.length === 0 ? (
          <EmptyState title="No library copy" message="This book is not available in libraries." />
        ) : (
          data.libraries.map((item) => (
            <GlassCard key={item._id}>
              <Text style={styles.cardTitle}>{item.library?.name}</Text>
              <Text style={styles.cardText}>{item.library?.address}</Text>
              <Text style={styles.cardText}>
                Copies: {item.availableCopies}/{item.totalCopies}
              </Text>
              <Text style={styles.cardText}>Shelf: {item.shelfNumber}</Text>

              <AppButton
                title="Reserve Library Book"
                onPress={() => reserveLibrary(item._id)}
              />
            </GlassCard>
          ))
        )}

        <SectionTitle>Local Book Shops</SectionTitle>

        {data.shops.length === 0 ? (
          <EmptyState title="No shop stock" message="No local shop has this book now." />
        ) : (
          data.shops.map((item) => (
            <GlassCard key={item._id}>
              <Text style={styles.cardTitle}>{item.shop?.name}</Text>
              <Text style={styles.cardText}>{item.shop?.address}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.cardText}>Stock: {item.stock}</Text>

              <AppButton
                title="Reserve Shop Book"
                onPress={() => reserveShop(item._id)}
              />
            </GlassCard>
          ))
        )}

        <SectionTitle>Student Marketplace</SectionTitle>

        {data.students.length === 0 ? (
          <EmptyState title="No student listing" message="No student is selling this book now." />
        ) : (
          data.students.map((item) => (
            <GlassCard key={item._id}>
              <Text style={styles.cardTitle}>{item.seller?.name}</Text>
              <Text style={styles.cardText}>Type: {item.listingType}</Text>
              <Text style={styles.cardText}>Condition: {item.condition}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.cardText}>Phone: {item.seller?.phone}</Text>
            </GlassCard>
          ))
        )}
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bookIcon: {
    fontSize: 52,
    marginBottom: 8
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 6
  },
  description: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: 12
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 6
  },
  cardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900'
  },
  cardText: {
    color: colors.muted,
    marginTop: 5,
    lineHeight: 20
  },
  price: {
    color: colors.success,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  badge: {
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    fontWeight: '800'
  }
});