import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';
import api from '../api/client';
import { colors } from '../utils/theme';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  async function loadNotifications() {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      Alert.alert('Error', 'Notification loading failed');
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Reservation, donation, and exchange updates.
        </Text>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <EmptyState
              title="No notifications"
              message="You are fully updated."
            />
          }
          renderItem={({ item }) => (
            <GlassCard style={!item.isRead && styles.unreadCard}>
              <Text style={styles.cardTitle}>🔔 {item.title}</Text>
              <Text style={styles.cardText}>{item.message}</Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
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
  unreadCard: {
    borderColor: colors.primary
  },
  cardTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900'
  },
  cardText: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20
  },
  date: {
    color: 'rgba(255,255,255,0.58)',
    marginTop: 10,
    fontSize: 12
  }
});