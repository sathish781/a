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
import { useAuth } from '../context/AuthContext';

export default function DonationScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'requests', 'history'
  const [donations, setDonations] = useState([]);
  const [myDonationRequests, setMyDonationRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Floating heart animation for donation claims
  const heartFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartFloat, { toValue: -6, duration: 1800, useNativeDriver: true }),
        Animated.timing(heartFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      if (activeTab === 'browse') {
        const res = await api.get('/donations');
        setDonations(res.data || []);
      } else if (activeTab === 'requests') {
        const res = await api.get('/donations/my-donations');
        setMyDonationRequests(res.data.filter((d) => d.status === 'pending_claim'));
      } else if (activeTab === 'history') {
        const [myDonationsRes, myClaimsRes] = await Promise.all([
          api.get('/donations/my-donations'),
          api.get('/donations/my-claims'),
        ]);

        const given = myDonationsRes.data.filter(
          (d) => d.status === 'claimed' || d.status === 'completed'
        );
        const received = myClaimsRes.data;

        const combined = [
          ...given.map((item) => ({ ...item, historyType: 'given' })),
          ...received.map((item) => ({ ...item, historyType: 'received' })),
        ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setHistory(combined);
      }
    } catch (error) {
      console.log('Donation error:', error);
      showToast('Failed to refresh donation hub.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function requestDonation(donationId) {
    try {
      await api.post('/donations/request', { donationId });
      showToast('Donation request sent! Wait for donor approval. ❤️', 'success');
      loadData();
    } catch (error) {
      showToast('Request failed', 'error');
    }
  }

  async function handleClaimAction(id, action) {
    try {
      setLoading(true);
      await api.patch(`/donations/${id}/${action}-claim`);
      showToast(`Claim request ${action}ed.`, 'success');
      loadData();
    } catch (error) {
      showToast('Action failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, activeTab]);

  const renderDonationItem = ({ item }) => (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <Animated.View
          style={[
            styles.giftCircle,
            {
              backgroundColor: theme.primary + '18',
              transform: [{ translateY: heartFloat }],
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>🎁</Text>
        </Animated.View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {item.book?.title}
          </Text>
          <Text style={[styles.author, { color: theme.muted }]}>
            by {item.book?.author || 'Unknown Author'}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: theme.success }]}>
          <Text style={styles.statusText}>FREE GIFT</Text>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.backgroundTwo }]}>
        <Text style={[styles.infoText, { color: theme.muted }]}>
          👤 Donor: <Text style={{ color: theme.text, fontWeight: '700' }}>{item.donor?.name}</Text>
        </Text>
        <Text style={[styles.infoText, { color: theme.muted }]}>
          📍 Pickup: <Text style={{ color: theme.text, fontWeight: '700' }}>{item.pickupLocation || 'Campus Area'}</Text>
        </Text>
      </View>

      <View style={styles.actionRow}>
        {item.donor?._id !== user?._id ? (
          <>
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.claimBtn, { backgroundColor: theme.primary }]}
              onPress={() => requestDonation(item._id)}
            >
              <Text style={styles.claimBtnText}>CLAIM BOOK ❤️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.chatBtn, { borderColor: theme.primary }]}
              onPress={() =>
                navigation.navigate('ChatDetail', {
                  userId: item.donor?._id,
                  userName: item.donor?.name,
                  bookId: item.book?._id,
                })
              }
            >
              <Text style={[styles.chatBtnText, { color: theme.primary }]}>CHAT</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.myLabel}>
            <Text style={{ color: theme.success, fontWeight: '900', fontSize: 10 }}>
              YOUR DONATION
            </Text>
          </View>
        )}
      </View>
    </GlassCard>
  );

  const renderRequestItem = ({ item }) => (
    <GlassCard style={styles.card}>
      <Text style={[styles.title, { color: theme.text }]}>{item.book?.title}</Text>
      <Text style={[styles.requestInfo, { color: theme.primary }]}>
        Request from: {item.recipientStudent?.name}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.88}
          style={[styles.acceptBtn, { backgroundColor: theme.success }]}
          onPress={() => handleClaimAction(item._id, 'accept')}
        >
          <Text style={styles.acceptBtnText}>APPROVE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.rejectBtn, { borderColor: theme.danger }]}
          onPress={() => handleClaimAction(item._id, 'reject')}
        >
          <Text style={[styles.rejectBtnText, { color: theme.danger }]}>DECLINE</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <GlassScreen>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Donation Hub</Text>
            <Text style={[styles.pageSub, { color: theme.muted }]}>
              Gift books to peers in your campus community.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.donateBtn, { backgroundColor: theme.primary }]}
            onPress={() =>
              navigation.navigate('SellBook', { listingType: 'donate', isDonation: true })
            }
          >
            <Text style={styles.donateIcon}>🎁</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {['browse', 'requests', 'history'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab,
                  isActive && { borderBottomColor: theme.primary, borderBottomWidth: 3 },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? theme.primary : theme.muted },
                  ]}
                >
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={{ marginTop: 10 }}>
            <ListSkeleton count={3} />
          </View>
        ) : (
          <FlatList
            data={
              activeTab === 'browse'
                ? donations
                : activeTab === 'requests'
                ? myDonationRequests
                : history
            }
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 110 }}
            onRefresh={loadData}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState title="Empty Hub" message="No donations found here." />
            }
            renderItem={
              activeTab === 'browse'
                ? renderDonationItem
                : activeTab === 'requests'
                ? renderRequestItem
                : renderDonationItem
            }
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pageTitle: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  pageSub: { fontSize: 13, marginTop: 2 },
  donateBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  donateIcon: { fontSize: 20 },
  tabs: { flexDirection: 'row', gap: 22, marginBottom: 16 },
  tab: { paddingVertical: 8 },
  tabText: { fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  card: { padding: 18, marginBottom: 14, borderRadius: 22 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  giftCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: '900' },
  author: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  infoBox: { marginTop: 14, padding: 12, borderRadius: 16, gap: 4 },
  infoText: { fontSize: 13, fontWeight: '500' },
  actionRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  claimBtn: { flex: 2, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  claimBtnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  chatBtn: { flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  chatBtnText: { fontWeight: '900', fontSize: 12 },
  myLabel: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 },
  requestInfo: { fontSize: 14, fontWeight: '800', marginTop: 8 },
  acceptBtn: { flex: 1, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  acceptBtnText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  rejectBtn: { flex: 1, height: 42, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { fontWeight: '900', fontSize: 13 },
});
