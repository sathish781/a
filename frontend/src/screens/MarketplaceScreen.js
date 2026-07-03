import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function MarketplaceScreen({ navigation }) {
  const [q, setQ] = useState('');
  const [listings, setListings] = useState([]);

  async function loadMarketplace() {
    try {
      const res = await api.get('/marketplace', {
        params: { q }
      });

      setListings(res.data);
    } catch (error) {
      Alert.alert('Error', 'Marketplace loading failed');
    }
  }

  async function sendExchange(listingId) {
    try {
      await api.post('/exchanges', {
        requestedListingId: listingId,
        message: 'I want to exchange this book.'
      });

      Alert.alert('Success', 'Exchange request sent');
    } catch (error) {
      Alert.alert('Error', 'Exchange request failed');
    }
  }

  useEffect(() => {
    loadMarketplace();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Student Marketplace</Text>
        <Text style={styles.subtitle}>Buy, sell, exchange, and donate used books.</Text>

        <GlassCard>
          <AppTextInput
            placeholder="Search used books"
            value={q}
            onChangeText={setQ}
          />

          <AppButton title="Search" onPress={loadMarketplace} />

          <AppButton
            title="Upload My Book"
            variant="dark"
            onPress={() => navigation.navigate('SellBook')}
          />
        </GlassCard>

        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <EmptyState
              title="No listings found"
              message="Upload your first used book."
            />
          }
          renderItem={({ item }) => (
            <GlassCard>
              <Text style={styles.cardTitle}>{item.book?.title}</Text>
              <Text style={styles.cardText}>{item.book?.author}</Text>

              <View style={styles.badgeRow}>
                <Text style={styles.badge}>{item.listingType}</Text>
                <Text style={styles.badge}>{item.condition}</Text>
              </View>

              <Text style={styles.price}>₹{item.price}</Text>
              <Text style={styles.cardText}>Seller: {item.seller?.name}</Text>
              <Text style={styles.cardText}>Phone: {item.seller?.phone}</Text>
              <Text style={styles.cardText}>College: {item.seller?.college}</Text>

              {item.listingType === 'exchange' && (
                <AppButton
                  title="Request Exchange"
                  onPress={() => sendExchange(item._id)}
                />
              )}
            </GlassCard>
          )}
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18
  },
  title: {
    color: colors.white,
    fontSize: 29,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 12
  },
  cardTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900'
  },
  cardText: {
    color: colors.muted,
    marginTop: 5
  },
  price: {
    color: colors.success,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  badge: {
    color: colors.white,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    fontWeight: '800'
  }
});