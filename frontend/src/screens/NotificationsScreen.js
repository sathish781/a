import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, FlatList, Alert, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';
import api from '../api/client';

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
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Reservation, donation, and exchange updates.
          </Text>
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 110 }}
          ListEmptyComponent={
            <EmptyState
              title="No notifications"
              message="You are fully up to date."
            />
          }
          renderItem={({ item }) => (
            <GlassCard style={[styles.notifCard, !item.isRead && styles.unreadCard]}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>🔔 {item.title}</Text>
                {!item.isRead && (
                  <View style={styles.newDot} />
                )}
              </View>
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
  notifCard: {
    padding: 16,
    marginVertical: 6,
  },
  unreadCard: {
    borderColor: '#6366f1',
    borderWidth: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  cardText: {
    color: '#94a3b8',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    color: '#64748b',
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
  },
});