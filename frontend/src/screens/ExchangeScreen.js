import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function ExchangeScreen() {
  const [exchanges, setExchanges] = useState([]);

  async function loadExchanges() {
    try {
      const res = await api.get('/exchanges/me');
      setExchanges(res.data);
    } catch (error) {
      Alert.alert('Error', 'Exchange loading failed');
    }
  }

  async function updateExchange(id, status) {
    try {
      await api.patch(`/exchanges/${id}`, { status });

      Alert.alert('Success', `Exchange ${status}`);
      loadExchanges();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Exchange update failed'
      );
    }
  }

  useEffect(() => {
    loadExchanges();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Exchange Requests</Text>
        <Text style={styles.subtitle}>
          Accept or reject student book exchange requests.
        </Text>

        <FlatList
          data={exchanges}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <EmptyState
              title="No exchange requests"
              message="Your exchange requests will appear here."
            />
          }
          renderItem={({ item }) => (
            <GlassCard>
              <Text style={styles.cardTitle}>
                {item.requestedListing?.book?.title || 'Requested Book'}
              </Text>

              <Text style={styles.cardText}>Requester: {item.requester?.name}</Text>
              <Text style={styles.cardText}>Owner: {item.owner?.name}</Text>
              <Text style={styles.cardText}>Message: {item.message}</Text>

              <Text style={styles.badge}>Status: {item.status}</Text>

              {item.status === 'pending' && (
                <>
                  <AppButton
                    title="Accept"
                    variant="success"
                    onPress={() => updateExchange(item._id, 'accepted')}
                  />

                  <AppButton
                    title="Reject"
                    variant="danger"
                    onPress={() => updateExchange(item._id, 'rejected')}
                  />
                </>
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
  badge: {
    color: colors.white,
    backgroundColor: 'rgba(96,165,250,0.22)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontWeight: '800'
  }
});