import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import EmptyState from '../components/EmptyState';
import { ListSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function ExchangeScreen({ route, navigation }) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'browse');
  const [exchanges, setExchanges] = useState([]);
  const [browseBooks, setBrowseBooks] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      if (activeTab === 'requests') {
        const res = await api.get('/exchanges/my-exchanges');
        setExchanges(res.data.filter((ex) => ex.status === 'pending'));
      } else if (activeTab === 'browse') {
        const res = await api.get('/exchanges');
        setBrowseBooks(res.data);
      } else if (activeTab === 'mylistings') {
        const res = await api.get('/books/my-books');
        setMyListings(res.data.filter((b) => b.listingType === 'exchange' && b.availability));
      } else if (activeTab === 'history') {
        const res = await api.get('/exchanges/my-exchanges');
        setHistory(res.data.filter((ex) => ['accepted', 'completed', 'rejected'].includes(ex.status)));
      }
    } catch (error) {
      showToast('Failed to refresh exchange data.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id, action) {
    try {
      await api.patch(`/exchanges/${id}/${action}`);
      showToast(`Swap request ${action}ed! 🎉`, 'success');
      loadData();
    } catch (error) {
      showToast('Action failed', 'error');
    }
  }

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
  }, [route.params?.initialTab]);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, activeTab]);

  const filteredBrowseBooks = browseBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderExchangeItem = ({ item }) => {
    const isIncoming = item.targetUser?._id === user?._id || item.targetUser === user?._id;
    const partner = isIncoming ? item.requester : item.targetUser;

    return (
      <GlassCard style={styles.exchangeCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.typeLabel, { color: theme.primary }]}>
            {isIncoming ? '📥 INCOMING REQUEST' : '📤 OUTGOING REQUEST'}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: '#f59e0b' }]}>
            <Text style={styles.statusText}>{item.status ? item.status.toUpperCase() : 'PENDING'}</Text>
          </View>
        </View>

        {/* Visual Swap Graphic */}
        <View style={[styles.swapGraphicBox, { backgroundColor: theme.backgroundTwo }]}>
          <View style={styles.bookStack}>
            <Text style={[styles.stackLabel, { color: theme.muted }]}>
              {isIncoming ? 'THEY WANT' : 'YOU WANT'}
            </Text>
            <Text style={[styles.stackTitle, { color: theme.text }]} numberOfLines={2}>
              📚 {item.requestedBook?.title || item.requestedBookTitle}
            </Text>
          </View>

          <View style={[styles.swapArrowCircle, { backgroundColor: theme.primary + '20' }]}>
            <Text style={{ fontSize: 20, color: theme.primary }}>⇄</Text>
          </View>

          <View style={styles.bookStack}>
            <Text style={[styles.stackLabel, { color: theme.muted }]}>
              {isIncoming ? 'THEY OFFER' : 'YOU OFFER'}
            </Text>
            <Text style={[styles.stackTitle, { color: theme.text }]} numberOfLines={2}>
              📖 {item.offeredBook?.title || item.offeredBookTitle}
            </Text>
          </View>
        </View>

        <Text style={[styles.partnerText, { color: theme.muted }]}>
          Partner Peer: <Text style={{ color: theme.text, fontWeight: '800' }}>{partner?.name || 'Student'}</Text>
        </Text>

        {isIncoming && item.status === 'pending' && (
          <View style={styles.btnRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.acceptBtn, { backgroundColor: theme.primary }]}
              onPress={() => handleAction(item._id, 'accept')}
            >
              <Text style={styles.btnText}>ACCEPT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.rejectBtn, { borderColor: theme.danger }]}
              onPress={() => handleAction(item._id, 'reject')}
            >
              <Text style={[styles.btnText, { color: theme.danger }]}>REJECT</Text>
            </TouchableOpacity>
          </View>
        )}
      </GlassCard>
    );
  };

  const renderBookItem = ({ item }) => (
    <GlassCard style={styles.browseCard}>
      <View style={styles.browseContent}>
        <Image
          source={{
            uri: item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
          }}
          style={styles.browseImg}
        />
        <View style={styles.browseInfo}>
          <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.bookAuthor, { color: theme.muted }]}>by {item.author}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: theme.primary + '18' }]}>
              <Text style={{ color: theme.primary, fontSize: 9, fontWeight: '900' }}>
                {item.condition ? item.condition.toUpperCase() : 'GOOD'}
              </Text>
            </View>
            {activeTab === 'browse' && (
              <Text style={[styles.ownerText, { color: theme.muted }]}>👤 {item.owner?.name}</Text>
            )}
          </View>
        </View>

        {activeTab === 'browse' && (
          <View style={styles.browseActionArea}>
            {item.owner?._id !== user?._id ? (
              <TouchableOpacity
                activeOpacity={0.88}
                style={[styles.initiateBtn, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('InitiateExchange', { requestedBook: item })}
              >
                <Text style={styles.initiateBtnText}>SWAP</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.myOwnBadge, { borderColor: theme.success }]}>
                <Text style={[styles.myOwnBadgeText, { color: theme.success }]}>MINE</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </GlassCard>
  );

  return (
    <GlassScreen>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.text }]}>Swap Hub</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              Peer-to-peer textbook exchange ecosystem.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.offerTopBtn, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('OfferExchangeBook')}
          >
            <Text style={styles.offerTopBtnText}>+ OFFER</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {[
            { id: 'browse', label: 'Available' },
            { id: 'requests', label: 'Swaps' },
            { id: 'mylistings', label: 'My Books' },
            { id: 'history', label: 'History' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
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
                  {tab.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeTab === 'browse' && (
          <View
            style={[
              styles.searchRow,
              { borderColor: theme.glassBorder, backgroundColor: theme.backgroundTwo },
            ]}
          >
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Find books to swap..."
              placeholderTextColor={theme.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Text style={{ fontSize: 18 }}>🔍</Text>
          </View>
        )}

        {loading ? (
          <View style={{ marginTop: 10 }}>
            <ListSkeleton count={3} />
          </View>
        ) : (
          <FlatList
            data={
              activeTab === 'requests'
                ? exchanges
                : activeTab === 'browse'
                ? filteredBrowseBooks
                : activeTab === 'mylistings'
                ? myListings
                : history
            }
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 110 }}
            onRefresh={loadData}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState title="Nothing here" message="Try offering a book for swap!" />
            }
            renderItem={
              activeTab === 'requests' || activeTab === 'history'
                ? renderExchangeItem
                : renderBookItem
            }
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  offerTopBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, elevation: 4 },
  offerTopBtnText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  tabsScroll: { flexDirection: 'row', marginBottom: 16, maxHeight: 46 },
  tab: { paddingVertical: 8, marginRight: 22 },
  tabText: { fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 48,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600' },
  exchangeCard: { padding: 18, marginBottom: 14, borderRadius: 22 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  swapGraphicBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    marginVertical: 6,
  },
  bookStack: { flex: 1 },
  stackLabel: { fontSize: 9, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 },
  stackTitle: { fontSize: 14, fontWeight: '800' },
  swapArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  partnerText: { fontSize: 12, marginTop: 10, fontWeight: '500' },
  btnRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  acceptBtn: { flex: 1, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rejectBtn: { flex: 1, height: 42, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
  browseCard: { padding: 14, marginBottom: 12, borderRadius: 20 },
  browseContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  browseImg: { width: 56, height: 76, borderRadius: 12 },
  browseInfo: { flex: 1 },
  bookTitle: { fontSize: 15, fontWeight: '900' },
  bookAuthor: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  ownerText: { fontSize: 11, fontWeight: '600' },
  browseActionArea: { marginLeft: 6 },
  initiateBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  initiateBtnText: { color: '#fff', fontWeight: '900', fontSize: 11 },
  myOwnBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  myOwnBadgeText: { fontSize: 10, fontWeight: '900' },
});
