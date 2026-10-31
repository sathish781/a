import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';
import { ListSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const { theme } = useThemeMode();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pulse animation for unread dot
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (error) {
      showToast('Notification loading failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  const getCategoryIcon = (type, title = '') => {
    const text = (type + ' ' + title).toLowerCase();
    if (text.includes('swap') || text.includes('exchange')) return '🔁';
    if (text.includes('donate') || text.includes('gift')) return '🎁';
    if (text.includes('library') || text.includes('borrow')) return '🏛️';
    if (text.includes('order') || text.includes('buy') || text.includes('shop')) return '🛒';
    if (text.includes('message') || text.includes('chat')) return '💬';
    return '🔔';
  };

  return (
    <GlassScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Reservation, donation, and exchange updates.
          </Text>
        </View>

        {loading ? (
          <ListSkeleton count={4} />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 110 }}
            showsVerticalScrollIndicator={false}
            onRefresh={loadNotifications}
            refreshing={loading}
            ListEmptyComponent={
              <EmptyState
                title="No notifications"
                message="You are fully up to date."
              />
            }
            renderItem={({ item }) => (
              <GlassCard
                style={[
                  styles.notifCard,
                  !item.isRead && {
                    borderColor: theme.primary,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <View style={styles.titleRow}>
                  <View style={styles.titleInfo}>
                    <Text style={styles.categoryIcon}>
                      {getCategoryIcon(item.type, item.title)}
                    </Text>
                    <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>

                  {!item.isRead && (
                    <Animated.View
                      style={[
                        styles.newDot,
                        {
                          backgroundColor: theme.primary,
                          shadowColor: theme.primary,
                          transform: [{ scale: pulseAnim }],
                        },
                      ]}
                    />
                  )}
                </View>

                <Text style={[styles.cardText, { color: theme.muted }]}>{item.message}</Text>
                <Text style={[styles.date, { color: theme.muted + '80' }]}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </GlassCard>
            )}
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  notifCard: {
    padding: 16,
    marginVertical: 6,
    borderRadius: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  newDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  cardText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  date: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
  },
});
