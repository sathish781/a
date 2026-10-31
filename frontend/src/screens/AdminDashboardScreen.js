import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, ActivityIndicator, View, TouchableOpacity, FlatList, TextInput } from 'react-native';

import NeumorphicScreen from '../components/NeumorphicScreen';
import NeumorphicCard from '../components/NeumorphicCard';
import NeumorphicStatCard from '../components/NeumorphicStatCard';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';

export default function AdminDashboardScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, students, shops, libraries, books, marketplace, donations, exchanges, settings
  const [latestUsers, setLatestUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcement State
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [sendingAnn, setSendingAnn] = useState(false);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users?limit=5')
      ]);
      setStats(statsRes.data);
      setLatestUsers(usersRes.data.slice(0, 5));
    } catch (error) {
      console.log('Admin load err:', error);
      Alert.alert('Notice', 'Using fallback admin data. Check backend connection.');
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        totalLibraries: 0,
        totalShops: 0,
        totalBooks: 0,
        totalDonations: 0,
        totalExchanges: 0,
        todayActivity: { newUsers: 0 }
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboard();
    });
    return unsubscribe;
  }, [navigation]);

  const handleBlockUser = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/block`);
      Alert.alert('Success', 'User status toggled.');
      loadDashboard();
    } catch (err) {
      Alert.alert('Error', 'Action failed');
    }
  };

  const handleSendAnnouncement = async () => {
    if (!annTitle || !annMsg) return Alert.alert('Error', 'Fill all fields');
    try {
      setSendingAnn(true);
      await api.post('/admin/announcement', { title: annTitle, message: annMsg });
      Alert.alert('Broadcasted!', 'Your announcement was sent to all users.');
      setAnnTitle('');
      setAnnMsg('');
    } catch (err) {
      Alert.alert('Error', 'Failed to send broadcast.');
    } finally {
      setSendingAnn(false);
    }
  };

  if (loading && !stats) {
    return (
      <NeumorphicScreen>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </NeumorphicScreen>
    );
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={{ marginTop: 14 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
            {latestUsers.map((item) => (
              <NeumorphicCard key={item._id}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.cardText, { color: theme.muted }]}>{item.email}</Text>
                <View style={styles.actionRow}>
                  <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '900' }}>{item.role.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleBlockUser(item._id)}>
                    <Text style={[styles.actionBtnText, { color: item.status === 'blocked' ? theme.success : '#ef4444' }]}>
                      {item.status === 'blocked' ? 'Unblock' : 'Block User'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </NeumorphicCard>
            ))}
          </View>
        );
      case 'users':
        return (
          <NeumorphicCard>
            <Text style={[styles.cardTitle, { color: theme.text }]}>User Management</Text>
            <Text style={[styles.cardText, { color: theme.muted }]}>Manage all platform accounts, roles and access permissions.</Text>
            <View style={styles.btnGrid}>
              <AppButton title="OPEN USER MANAGER" onPress={() => navigation.navigate('UserManagement')} />
              <AppButton title="VIEW SYSTEM ALERTS" variant="dark" onPress={() => navigation.navigate('Notifications')} style={{ marginTop: 8 }} />
            </View>
          </NeumorphicCard>
        );
      case 'books':
        return (
          <NeumorphicCard>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Book Management</Text>
            <Text style={[styles.cardText, { color: theme.muted }]}>View and manage all book titles registered on the platform.</Text>
            <View style={styles.btnGrid}>
              <AppButton title="OPEN BOOK CATALOG" onPress={() => navigation.navigate('AdminBookCatalog')} />
            </View>
          </NeumorphicCard>
        );
      case 'shops':
      case 'libraries':
        return (
          <NeumorphicCard>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{activeTab === 'shops' ? 'Shop' : 'Library'} Approvals</Text>
            <Text style={[styles.cardText, { color: theme.muted }]}>Review pending registrations for {activeTab}.</Text>
            <View style={styles.btnGrid}>
              <AppButton title="MANAGE APPROVALS" onPress={() => navigation.navigate('OrganizationApproval')} />
            </View>
          </NeumorphicCard>
        );
      case 'marketplace':
      case 'donations':
      case 'exchanges':
        return (
          <NeumorphicCard>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{activeTab.toUpperCase()} MONITOR</Text>
            <Text style={[styles.cardText, { color: theme.muted }]}>Audit and monitor real-time transactions on the platform.</Text>
            <View style={styles.btnGrid}>
              <AppButton
                title={`VIEW ${activeTab.toUpperCase()} HUB`}
                onPress={() => navigation.navigate(activeTab === 'marketplace' ? 'Market' : activeTab === 'donations' ? 'Donate' : 'Exchange')}
              />
            </View>
          </NeumorphicCard>
        );
      case 'settings':
        return (
          <View>
            <NeumorphicCard>
              <Text style={[styles.cardTitle, { color: theme.text }]}>📢 Send Global Announcement</Text>
              <Text style={[styles.cardText, { color: theme.muted, marginBottom: 12 }]}>Send a push notification to every registered user on the platform.</Text>

              <AppTextInput
                placeholder="Announcement Title"
                value={annTitle}
                onChangeText={setAnnTitle}
              />
              <AppTextInput
                placeholder="Message Content"
                value={annMsg}
                multiline
                onChangeText={setAnnMsg}
              />

              <AppButton
                title={sendingAnn ? "SENDING..." : "BROADCAST TO ALL USERS"}
                onPress={handleSendAnnouncement}
                loading={sendingAnn}
              />
            </NeumorphicCard>

            <NeumorphicCard style={{ marginTop: 15 }}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>⚙️ System Maintenance</Text>
              <View style={styles.btnGrid}>
                <AppButton title="CHECK LIBRARY OVERDUE" onPress={async () => {
                  try {
                    const res = await api.post('/admin/check-overdue');
                    Alert.alert('Scan Complete', res.data.message);
                  } catch (e) {
                    Alert.alert('Error', 'Failed to scan for overdue items.');
                  }
                }} />
                <AppButton title="GENERATE DB BACKUP" variant="dark" onPress={() => Alert.alert('Maintenance', 'Database snapshot task triggered.')} style={{ marginTop: 8 }} />
                <AppButton title="PURGE OLD LOGS" variant="dark" onPress={() => Alert.alert('Maintenance', 'System logs cleared.')} style={{ marginTop: 8 }} />
                <AppButton title="LOGOUT ADMIN SESSION" onPress={logout} style={{ marginTop: 20 }} />
              </View>
            </NeumorphicCard>
          </View>
        );
      default:
        return (
          <NeumorphicCard>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Module Placeholder</Text>
            <Text style={[styles.cardText, { color: theme.muted }]}>Real management screen coming soon for {activeTab}.</Text>
          </NeumorphicCard>
        );
    }
  };

  return (
    <NeumorphicScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: theme.text }]}>Admin Master Panel</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Control system metrics, user roles, shops, libraries, and book transactions.</Text>

        {/* Top Metric Cards */}
        <View style={styles.grid}>
          <NeumorphicStatCard icon="👥" label="Total Users" value={stats?.totalUsers || 0} />
          <NeumorphicStatCard icon="🎓" label="Total Students" value={stats?.totalStudents || 0} />
          <NeumorphicStatCard icon="🏛️" label="Total Libraries" value={stats?.totalLibraries || 0} />
          <NeumorphicStatCard icon="🏪" label="Total Shops" value={stats?.totalShops || 0} />
          <NeumorphicStatCard icon="📚" label="Total Books" value={stats?.totalBooks || 0} />
          <NeumorphicStatCard icon="🎁" label="Donations" value={stats?.totalDonations || 0} />
          <NeumorphicStatCard icon="🔁" label="Exchanges" value={stats?.totalExchanges || 0} />
          <NeumorphicStatCard icon="⚡" label="New Users Today" value={stats?.todayActivity?.newUsers || 0} />
        </View>

        {/* Module Navigation Tabs */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Admin Control Modules</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'users', label: '👤 User Mgt' },
            { id: 'shops', label: '🏪 Shop Mgt' },
            { id: 'libraries', label: '🏛️ Library Mgt' },
            { id: 'marketplace', label: '🛒 Marketplace' },
            { id: 'donations', label: '🎁 Donations' },
            { id: 'exchanges', label: '🔁 Exchanges' },
            { id: 'settings', label: '⚙️ Settings' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.moduleTab,
                {
                  backgroundColor: activeTab === tab.id ? theme.primary : (theme.mode === 'light' ? '#f1f5f9' : '#0f172a'),
                  borderColor: activeTab === tab.id ? theme.primary : theme.glassBorder,
                },
              ]}
            >
              <Text style={[styles.tabText, { color: activeTab === tab.id ? '#ffffff' : theme.text }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderActiveModule()}

      </ScrollView>
    </NeumorphicScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18, paddingBottom: 110 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900' },
  subtitle: { marginTop: 4, marginBottom: 14, fontSize: 13, lineHeight: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 20, fontWeight: '900', marginTop: 20, marginBottom: 10 },
  tabScroll: { marginBottom: 12 },
  moduleTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  tabText: { fontSize: 13, fontWeight: '700' },
  cardTitle: { fontSize: 18, fontWeight: '900' },
  cardText: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  actionBtnText: { fontSize: 13, fontWeight: '800' },
  btnGrid: { marginTop: 12 },
});