import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function DonationScreen() {
  const [donations, setDonations] = useState([]);

  async function loadDonations() {
    try {
      const res = await api.get('/donations');
      setDonations(res.data);
    } catch (error) {
      Alert.alert('Error', 'Donation loading failed');
    }
  }

  async function requestDonation(donationId) {
    try {
      await api.post('/donations/request', {
        donationId
      });

      Alert.alert('Success', 'Donation request sent');
      loadDonations();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Donation request failed'
      );
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Book Donations</Text>
        <Text style={styles.subtitle}>
          Request free books donated by students.
        </Text>

        <FlatList
          data={donations}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <EmptyState
              title="No donations found"
              message="Donated books will appear here."
            />
          }
          renderItem={({ item }) => (
            <GlassCard>
              <Text style={styles.icon}>🎁</Text>
              <Text style={styles.cardTitle}>{item.listing?.book?.title}</Text>
              <Text style={styles.cardText}>{item.listing?.book?.author}</Text>
              <Text style={styles.cardText}>Donor: {item.donor?.name}</Text>
              <Text style={styles.cardText}>College: {item.donor?.college}</Text>
              <Text style={styles.cardText}>Badges: {item.donor?.badgeCount}</Text>
              <Text style={styles.badge}>Status: {item.status}</Text>

              {item.status === 'available' && (
                <AppButton
                  title="Request Donation"
                  onPress={() => requestDonation(item._id)}
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
    fontSize: 30,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 14
  },
  icon: {
    fontSize: 32,
    marginBottom: 8
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
  badge: {
    color: colors.white,
    backgroundColor: 'rgba(34,197,94,0.22)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
    fontWeight: '800'
  }
});