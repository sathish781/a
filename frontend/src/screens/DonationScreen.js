import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function DonationScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadDonations() {
    try {
      setLoading(true);
      const res = await api.get('/donations');
      setDonations(res.data || []);
    } catch (error) {
      console.log('Donation load error:', error);
      Alert.alert('Notice', 'Could not fetch donations list.');
    } finally {
      setLoading(false);
    }
  }

  async function requestDonation(donationId) {
    try {
      await api.post('/donations/request', { donationId });
      Alert.alert('Success 🎉', 'Donation request sent! The donor will contact you.');
      loadDonations();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Donation request failed'
      );
    }
  }

  function handleNavigateToDonate() {
    if (navigation) {
      navigation.navigate('SellBook', { listingType: 'donate', isDonation: true });
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Book Donations</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Request free books donated by generous students or contribute your own.
          </Text>
        </View>

        {/* Donate Action Card & Button */}
        <GlassCard style={styles.actionBanner}>
          <View style={styles.bannerRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.bannerTitle, { color: theme.text }]}>Have books to share?</Text>
              <Text style={[styles.bannerSub, { color: theme.muted }]}>
                Help fellow students by donating your unused textbooks.
              </Text>
            </View>
            <AppButton
              title="🎁 DONATE A BOOK"
              onPress={handleNavigateToDonate}
              style={styles.donateBtn}
            />
          </View>
        </GlassCard>

        <FlatList
          data={donations}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 110 }}
          onRefresh={loadDonations}
          refreshing={loading}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <EmptyState
                title="No donations found"
                message="No donated books available right now. Be the first to donate a book!"
              />
              <AppButton
                title="🎁 DONATE A BOOK NOW"
                onPress={handleNavigateToDonate}
                style={styles.emptyDonateBtn}
              />
            </View>
          }
          renderItem={({ item }) => (
            <GlassCard style={styles.donationCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.giftIconCircle}>
                  <Text style={styles.giftIcon}>🎁</Text>
                </View>
                <View style={styles.redBadge}>
                  <Text style={styles.redBadgeText}>{item.status || 'Available'}</Text>
                </View>
              </View>

              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.book?.title || item.listing?.book?.title || 'Donated Book'}
              </Text>
              <Text style={[styles.authorText, { color: theme.primary }]}>
                Author: {item.book?.author || item.listing?.book?.author || 'Unknown Author'}
              </Text>

              <View style={[styles.detailsBox, { backgroundColor: theme.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }]}>
                <Text style={[styles.cardText, { color: theme.muted }]}>👤 Donor: {item.donor?.name || 'Anonymous Donor'}</Text>
                <Text style={[styles.cardText, { color: theme.muted }]}>🏫 Pickup Location: {item.pickupLocation || item.book?.location || item.donor?.college || 'Main Campus'}</Text>
                {item.book?.category ? (
                  <Text style={[styles.cardText, { color: theme.muted }]}>📚 Category: {item.book.category}</Text>
                ) : null}
              </View>

              {item.status === 'available' && (
                <AppButton
                  title="CLAIM FREE DONATION"
                  onPress={() => requestDonation(item._id)}
                  style={{ marginTop: 12 }}
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
    padding: 18,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  actionBanner: {
    padding: 14,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'column',
    gap: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  bannerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  donateBtn: {
    width: '100%',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  emptyDonateBtn: {
    marginTop: 16,
    minWidth: 220,
  },
  donationCard: {
    padding: 18,
    marginVertical: 8,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  giftIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#090a14',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftIcon: {
    fontSize: 22,
  },
  redBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  redBadgeText: {
    color: '#6366f1',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  authorText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailsBox: {
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  cardText: {
    fontSize: 13,
    marginVertical: 2,
    fontWeight: '500',
  },
});