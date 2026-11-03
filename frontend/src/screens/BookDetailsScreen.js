import React, { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity, Animated } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../context/ToastContext';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

function SectionTitle({ children }) {
  const { theme } = useThemeMode();
  return <Text style={[styles.sectionTitle, { color: theme.text }]}>{children}</Text>;
}

export default function BookDetailsScreen({ route, navigation }) {
  const { bookId } = route.params;
  const { user } = useAuth();
  const { theme } = useThemeMode();
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Floating book animation
  const bookFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bookFloat, { toValue: -8, duration: 2200, useNativeDriver: true }),
        Animated.timing(bookFloat, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  async function loadDetails() {
    try {
      setLoading(true);
      const details = await api.get(`/books/${bookId}`);
      const priceRes = await api.get(`/books/${bookId}/compare`);
      setData(details.data);
      setPrices(priceRes.data);
    } catch (error) {
      console.log('Details load error:', error);
      showToast('Unable to load book details', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function reserveLibrary(libraryBookId) {
    try {
      await api.post('/reservations', { sourceType: 'library', libraryBookId });
      showToast('Library book reserved successfully! 🏛️', 'success');
      loadDetails();
    } catch (error) {
      showToast(error.response?.data?.message || 'Reservation failed', 'error');
    }
  }

  async function reserveShop(item) {
    try {
      const bId = item.book?._id || data.book?._id;
      if (bId) {
        await api.post('/shop-requests', {
          bookId: bId,
          price: item.price
        });
      }

      await api.post('/reservations', { sourceType: 'shop', shopBookId: item._id });
      showToast('Order request sent to shop owner! 🏪 Check Orders.', 'success');
    } catch (error) {
      console.log('Shop order request error:', error);
      showToast(error.response?.data?.message || 'Order request failed', 'error');
    }
  }

  useEffect(() => {
    loadDetails();
  }, []);

  if (loading || !data) {
    return (
      <GlassScreen>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <GlassCard>
          <Animated.Text style={[styles.bookIcon, { transform: [{ translateY: bookFloat }] }]}>
            📘
          </Animated.Text>
          <Text style={[styles.title, { color: theme.text }]}>{data.book?.title}</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>by {data.book?.author}</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.backgroundTwo, borderColor: theme.glassBorder, borderWidth: 1 }]}>
              <Text style={{ color: theme.primary, fontWeight: '800' }}>{data.book?.examType || 'Academic'}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.backgroundTwo, borderColor: theme.glassBorder, borderWidth: 1 }]}>
              <Text style={{ color: theme.primary, fontWeight: '800' }}>{data.book?.category || 'Book'}</Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.muted }]}>
            {data.book?.description || 'No description available for this textbook.'}
          </Text>
        </GlassCard>

        <SectionTitle>Price Comparison</SectionTitle>
        {prices.length === 0 ? (
          <EmptyState title="No price data" message="No sources available now." />
        ) : (
          prices.map((item, index) => (
            <GlassCard key={index}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.source}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={[styles.pricePrefix, { color: theme.success }]}>₹</Text>
                <AnimatedNumber value={item.price} style={[styles.price, { color: theme.success }]} />
              </View>
              <Text style={[styles.cardText, { color: theme.muted }]}>Stock: {item.stock}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>{item.note}</Text>
            </GlassCard>
          ))
        )}

        <SectionTitle>Library Availability</SectionTitle>
        {data.libraries.length === 0 ? (
          <EmptyState title="No library copy" message="This book is not available in libraries." />
        ) : (
          data.libraries.map((item) => (
            <GlassCard key={item._id}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.library?.name}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>{item.library?.address}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>Copies: {item.availableCopies}/{item.totalCopies}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>Shelf: {item.shelfNumber}</Text>
              <AppButton title="Reserve Library Book" onPress={() => reserveLibrary(item._id)} style={{ marginTop: 10 }} />
            </GlassCard>
          ))
        )}

        <SectionTitle>Local Book Shops</SectionTitle>
        {data.shops.length === 0 ? (
          <EmptyState title="No shop stock" message="No local shop has this book now." />
        ) : (
          data.shops.map((item) => (
            <GlassCard key={item._id}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.shop?.name}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>{item.shop?.address}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={[styles.pricePrefix, { color: theme.primary }]}>₹</Text>
                <AnimatedNumber value={item.price} style={[styles.price, { color: theme.primary }]} />
              </View>
              <Text style={[styles.cardText, { color: theme.muted }]}>Stock: {item.stock}</Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <AppButton
                  title="ORDER BOOK"
                  onPress={() => reserveShop(item)}
                  style={{ flex: 1 }}
                />
                <TouchableOpacity
                  style={[styles.chatShopBtn, { borderColor: theme.primary }]}
                  onPress={() => navigation.navigate('ChatDetail', {
                    userId: item.owner?._id || item.shop?._id,
                    userName: item.owner?.shopName || item.owner?.name || item.shop?.name || item.shop?.shopName,
                    bookId: data.book?._id,
                  })}
                >
                  <Text style={[styles.chatShopBtnText, { color: theme.primary }]}>💬 CHAT</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))
        )}

        <SectionTitle>Student Marketplace</SectionTitle>
        {data.students.length === 0 ? (
          <EmptyState title="No student listing" message="No student is selling this book now." />
        ) : (
          data.students.map((item) => (
            <GlassCard key={item._id}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.owner?.name || item.seller?.name}</Text>
                {item.listingType === 'exchange' && (
                  <View style={styles.exchangeBadge}>
                    <Text style={styles.exchangeBadgeText}>SWAP AVAILABLE</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.cardText, { color: theme.muted }]}>Type: {item.listingType}</Text>
              <Text style={[styles.cardText, { color: theme.muted }]}>Condition: {item.condition}</Text>
              {item.listingType === 'sell' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={[styles.pricePrefix, { color: theme.primary }]}>₹</Text>
                  <AnimatedNumber value={item.price} style={[styles.price, { color: theme.primary }]} />
                </View>
              )}

              {(item.owner?._id || item.seller?._id) !== user?._id && (
                <View style={{ marginTop: 12, gap: 8 }}>
                  {item.listingType === 'exchange' && (
                    <AppButton
                      title="🤝 REQUEST EXCHANGE"
                      variant="gold"
                      onPress={() => navigation.navigate('InitiateExchange', { requestedBook: { ...data.book, owner: item.owner || item.seller, _id: item._id } })}
                    />
                  )}
                  {item.listingType === 'sell' && (
                    <AppButton
                      title="💰 REQUEST TO BUY"
                      onPress={async () => {
                        try {
                          await api.post(`/marketplace/${item._id}/request`);
                          showToast('Buy request sent to seller! Track in Orders.', 'success');
                        } catch (e) {
                          showToast(e.response?.data?.message || 'Request failed', 'error');
                        }
                      }}
                    />
                  )}
                  <AppButton
                    title="💬 CHAT WITH OWNER"
                    variant="dark"
                    onPress={() => navigation.navigate('ChatDetail', {
                      userId: item.owner?._id || item.seller?._id,
                      userName: item.owner?.name || item.seller?.name,
                      bookId: data.book?._id,
                    })}
                  />
                </View>
              )}
            </GlassCard>
          ))
        )}

      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 110 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bookIcon: { fontSize: 52, marginBottom: 8, alignSelf: 'flex-start' },
  title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.4 },
  subtitle: { fontSize: 15, marginTop: 4, fontWeight: '600' },
  description: { lineHeight: 22, marginTop: 12, fontSize: 14, fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginTop: 22, marginBottom: 6, letterSpacing: -0.3 },
  cardTitle: { fontSize: 17, fontWeight: '900' },
  cardText: { marginTop: 4, lineHeight: 18, fontSize: 13, fontWeight: '500' },
  pricePrefix: { fontSize: 20, fontWeight: '900' },
  price: { fontSize: 22, fontWeight: '900' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, marginRight: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exchangeBadge: { backgroundColor: '#f59e0b', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  exchangeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  chatShopBtn: {
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
  },
  chatShopBtnText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
