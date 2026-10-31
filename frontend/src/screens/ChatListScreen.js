import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppHeader from '../components/AppHeader';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function ChatListScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadChats() {
    try {
      setLoading(true);
      const res = await api.get('/messages/conversations');
      setChats(res.data);
    } catch (error) {
      console.log('Load chats error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadChats();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading && chats.length === 0) {
    return (
      <GlassScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </GlassScreen>
    );
  }

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader
          title="Direct Messages"
          subtitle="Chat with book owners and buyers"
          icon="💬"
        />

        <FlatList
          data={chats}
          keyExtractor={(item) => item.partner?._id || Math.random().toString()}
          onRefresh={loadChats}
          refreshing={loading}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ color: theme.muted, fontSize: 16 }}>No active conversations yet.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ChatDetail', {
                userId: item.partner._id,
                userName: item.partner.name
              })}
            >
              <GlassCard style={styles.chatCard}>
                <View style={styles.row}>
                  <View style={[styles.avatar, { backgroundColor: theme.backgroundTwo }]}>
                    <Text style={styles.avatarText}>{item.partner.name?.[0].toUpperCase()}</Text>
                  </View>
                  <View style={styles.content}>
                    <View style={styles.headerRow}>
                      <Text style={[styles.name, { color: theme.text }]}>{item.partner.name}</Text>
                      <Text style={[styles.time, { color: theme.muted }]}>
                        {new Date(item.lastMessage.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.lastMsg,
                        { color: item.lastMessage.isRead ? theme.muted : theme.text },
                        !item.lastMessage.isRead && { fontWeight: '700' }
                      ]}
                    >
                      {item.lastMessage.content}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { marginTop: 100, alignItems: 'center' },
  chatCard: { padding: 12, marginVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#f97316' },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '800' },
  time: { fontSize: 11 },
  lastMsg: { fontSize: 13 },
});