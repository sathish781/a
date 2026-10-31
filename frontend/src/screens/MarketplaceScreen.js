import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import { ListSkeleton } from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function MarketplaceScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('available'); // 'available', 'orders', 'history'
  const [q, setQ] = useState('');
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      if (activeTab === 'available') {
        const res = await api.get('/marketplace', { params: { q } });
        setListings(res.data || []);
      } else if (activeTab === 'orders') {
        const [purchases, sales] = await Promise.all([
          api.get('/marketplace/my-purchases'),
          api.get('/marketplace/my-sales'),
        ]);

        const combined = [
          ...purchases.data
            .filter((o) => o.status === 'pending' || o.status === 'accepted')
            .map((o) => ({ ...o, type: 'PURCHASE' })),
          ...sales.data
            .filter((o) => o.status === 'pending' || o.status === 'accepted')
            .map((o) => ({ ...o, type: 'SALE' })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(combined);
      } else if (activeTab === 'history') {
        const [purchases, sales] = await Promise.all([
          api.get('/marketplace/my-purchases'),
          api.get('/marketplace/my-sales'),
        ]);

        const combined = [
          ...purchases.data
            .filter((o) => o.status === 'completed' || o.status === 'rejected')
            .map((o) => ({ ...o, type: 'PURCHASE' })),
          ...sales.data
            .filter((o) => o.status === 'completed' || o.status === 'rejected')
            .map((o) => ({ ...o, type: 'SALE' })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setHistory(combined);
      }
    } catch (error) {
      console.log('Marketplace error:', error);
      showToast('Failed to refresh marketplace data.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderAction(id, action) {
    try {
      setLoading(true);
      await api.patch(`/marketplace/orders/${id}/${action}`);
      showToast(`Order ${action}ed successfully!`, 'success');
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Action failed', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function requestBuy(listingId) {
    try {
      await api.post(`/marketplace/${listingId}/request`);
      showToast('Buy request sent to seller! Check "Orders" tab. 🎉', 'success');
      loadData();
    } catch (error) {
      showToast(error.response?.data?.message || 'Request failed', 'error');
    }
  }

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, activeTab]);

  const renderListingItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('BookDetails', { bookId: item.book?._id })}
    >
      <GlassCard style={styles.listingCard}>
        <View style={styles.cardHeader}>
          <Image
            source={{
              uri: item.book?.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
            }}
            style={styles.bookImage}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
              {item.book?.title}
            </Text>
            <Text style={[styles.cardAuthor, { color: theme.muted }]}>
              by {item.book?.author || 'Unknown Author'}
            </Text>
            <View style={styles.priceRow}>
              <Text style={[styles.priceText, { color: theme.primary }]}>₹{item.price}</Text>
              <View style={[styles.conditionBadge, { borderColor: theme.glassBorder }]}>
                <Text style={{ color: theme.muted, fontSize: 10, fontWeight: '700' }}>
                  {item.condition}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.sellerInfo, { borderTopColor: theme.glassBorder }]}>
          <Text style={[styles.sellerName, { color: theme.text }]}>👤 {item.seller?.name}</Text>
          <Text style={[styles.sellerLoc, { color: theme.muted }]}>
            📍 {item.seller?.college || item.seller?.locationName || 'Campus'}
          </Text>
        </View>

        <View style={styles.actionRow}>
          {item.seller?._id !== user?._id ? (
            <>
              <TouchableOpacity
                activeOpacity={0.88}
                style={[styles.buyBtn, { backgroundColor: theme.primary }]}
                onPress={() => requestBuy(item._id)}
              >
                <Text style={styles.buyBtnText}>BUY NOW</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.chatBtn, { borderColor: theme.primary }]}
                onPress={() =>
                  navigation.navigate('ChatDetail', {
                    userId: item.seller?._id,
                    userName: item.seller?.name,
                    bookId: item.book?._id,
                  })
                }
              >
                <Text style={[styles.chatBtnText, { color: theme.primary }]}>CHAT</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.myListingLabel}>
              <Text style={{ color: theme.success, fontWeight: '900', fontSize: 10 }}>
                YOUR LISTING
              </Text>
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }) => (
    <GlassCard style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={[styles.typeBadge, { backgroundColor: item.type === 'SALE' ? theme.primary : theme.success }]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'pending' ? '#f59e0b' : theme.success }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={[styles.orderTitle, { color: theme.text }]}>{item.book?.title}</Text>
      <Text style={[styles.orderSub, { color: theme.muted }]}>
        {item.type === 'SALE' ? `Buyer: ${item.buyer?.name}` : `Seller: ${item.seller?.name}`}
      </Text>

      <View style={styles.orderFooter}>
        <Text style={[styles.orderPrice, { color: theme.primary }]}>₹{item.price}</Text>
        <Text style={[styles.orderDate, { color: theme.muted }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.status === 'pending' && item.type === 'SALE' && (
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.acceptBtn, { backgroundColor: theme.success }]}
            onPress={() => handleOrderAction(item._id, 'accept')}
          >
            <Text style={styles.acceptBtnText}>ACCEPT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectBtn, { borderColor: theme.danger }]}
            onPress={() => handleOrderAction(item._id, 'reject')}
          >
            <Text style={[styles.rejectBtnText, { color: theme.danger }]}>REJECT</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === 'accepted' && (
        <AppButton
          title="💬 CHAT TO COORDINATE"
          variant="dark"
          onPress={() =>
            navigation.navigate('ChatDetail', {
              userId: item.type === 'SALE' ? item.buyer?._id : item.seller?._id,
              userName: item.type === 'SALE' ? item.buyer?.name : item.seller?.name,
              bookId: item.book?._id,
            })
          }
          style={{ marginTop: 12 }}
        />
      )}
    </GlassCard>
  );

  return (
    <GlassScreen>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Marketplace</Text>
            <Text style={[styles.pageSub, { color: theme.muted }]}>
              Pre-loved textbooks from campus peers.
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.88}
            style={[styles.plusBtn, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('SellBook')}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Animated Category / Module Tabs */}
        <View style={styles.tabs}>
          {['available', 'orders', 'history'].map((tab) => {
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

        {activeTab === 'available' && (
          <View
            style={[
              styles.searchRow,
              { backgroundColor: theme.backgroundTwo, borderColor: theme.glassBorder },
            ]}
          >
            <TextInput
              placeholder="Search by title or author..."
              placeholderTextColor={theme.muted}
              style={[styles.searchInput, { color: theme.text }]}
              value={q}
              onChangeText={setQ}
              onSubmitEditing={loadData}
            />
            <TouchableOpacity onPress={loadData}>
              <Text style={{ fontSize: 18 }}>🔍</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={{ marginTop: 10 }}>
            <ListSkeleton count={3} />
          </View>
        ) : (
          <FlatList
            data={activeTab === 'available' ? listings : activeTab === 'orders' ? orders : history}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 110 }}
            onRefresh={loadData}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                title="Nothing found"
                message={
                  activeTab === 'available'
                    ? 'No books for sale right now.'
                    : 'No orders recorded.'
                }
              />
            }
            renderItem={activeTab === 'available' ? renderListingItem : renderOrderItem}
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
  plusBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  plusIcon: { color: '#fff', fontSize: 24, fontWeight: '300' },
  tabs: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  tab: { paddingVertical: 8 },
  tabText: { fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 48, borderRadius: 16, borderWidth: 1.5, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '600' },
  listingCard: { padding: 16, marginBottom: 14, borderRadius: 22 },
  cardHeader: { flexDirection: 'row', gap: 14 },
  bookImage: { width: 80, height: 110, borderRadius: 14 },
  headerInfo: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '900' },
  cardAuthor: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  priceText: { fontSize: 18, fontWeight: '900' },
  conditionBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  sellerInfo: { marginTop: 14, paddingTop: 10, borderTopWidth: 1.5, gap: 3 },
  sellerName: { fontSize: 13, fontWeight: '700' },
  sellerLoc: { fontSize: 12, fontWeight: '500' },
  actionRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
  buyBtn: { flex: 2, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  buyBtnText: { color: '#fff', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  chatBtn: { flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  chatBtnText: { fontWeight: '900', fontSize: 13 },
  myListingLabel: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 },
  orderCard: { padding: 18, marginBottom: 14, borderRadius: 22 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  orderTitle: { fontSize: 16, fontWeight: '900' },
  orderSub: { fontSize: 13, marginTop: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  orderPrice: { fontSize: 18, fontWeight: '900' },
  orderDate: { fontSize: 11, fontWeight: '600' },
  btnRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  acceptBtn: { flex: 1, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  acceptBtnText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  rejectBtn: { flex: 1, height: 42, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
  rejectBtnText: { fontWeight: '900', fontSize: 13 },
});
