import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import api from '../api/client';

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
        <View style={styles.header}>
          <Text style={styles.title}>Book Exchange Requests</Text>
          <Text style={styles.subtitle}>
            Accept or reject student book swap requests.
          </Text>
        </View>

        <FlatList
          data={exchanges}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <EmptyState
              title="No exchange requests"
              message="Your book swap requests will appear here."
            />
          }
          renderItem={({ item }) => (
            <GlassCard style={styles.exchangeCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>
                  {item.requestedListing?.book?.title || 'Requested Book'}
                </Text>
                <View style={styles.redBadge}>
                  <Text style={styles.redBadgeText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.cardText}>👤 Requester: {item.requester?.name || 'Student'}</Text>
              <Text style={styles.cardText}>📚 Owner: {item.owner?.name || 'Owner'}</Text>
              {item.message ? (
                <Text style={styles.messageText}>💬 "{item.message}"</Text>
              ) : null}

              {item.status === 'pending' && (
                <View style={styles.btnRow}>
                  <AppButton
                    title="ACCEPT"
                    variant="success"
                    onPress={() => updateExchange(item._id, 'accepted')}
                    style={{ flex: 1, marginRight: 6 }}
                  />

                  <AppButton
                    title="REJECT"
                    variant="danger"
                    onPress={() => updateExchange(item._id, 'rejected')}
                    style={{ flex: 1, marginLeft: 6 }}
                  />
                </View>
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
    marginBottom: 16,
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
  },
  exchangeCard: {
    padding: 18,
    marginVertical: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    flex: 1,
    marginRight: 10,
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
  cardText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  messageText: {
    color: '#f8fafc',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
});