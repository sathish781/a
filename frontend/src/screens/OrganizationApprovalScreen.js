import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppHeader from '../components/AppHeader';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function OrganizationApprovalScreen({ route }) {
  const { theme } = useThemeMode();
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'orgs'); // orgs, donations
  const [items, setItems] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      if (activeTab === 'orgs') {
        const res = await api.get('/admin/users', { params: { status: 'active' } });
        const pending = res.data.filter(
          (u) => (u.role === 'shop' || u.role === 'library') && u.approvalStatus === 'pending'
        );
        setItems(pending);
      } else {
        const res = await api.get('/donations/all');
        const pending = res.data.filter(d => d.adminApprovalStatus === 'pending');
        setDonations(pending);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch pending items.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function handleOrgAction(id, type, action) {
    try {
      const endpoint = type === 'shop' ? `/admin/shops/${id}/${action}` : `/admin/libraries/${id}/${action}`;
      await api.patch(endpoint);
      Alert.alert('Success', `Organization ${action}ed.`);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Action failed.');
    }
  }

  async function handleDonationAction(id, action) {
    try {
      await api.patch(`/donations/${id}/${action}`);
      Alert.alert('Success', `Donation ${action}ed.`);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Action failed.');
    }
  }

  const renderOrg = ({ item }) => (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.name, { color: theme.text }]}>{item.shopName || item.libraryName || item.name}</Text>
          <Text style={[styles.role, { color: theme.primary }]}>{item.role.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={[styles.detail, { color: theme.muted }]}>📧 {item.email}</Text>
        <Text style={[styles.detail, { color: theme.muted }]}>📍 {item.shopAddress || item.libraryAddress || item.location}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.success }]} onPress={() => handleOrgAction(item._id, item.role, 'approve')}>
          <Text style={styles.btnText}>APPROVE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.danger }]} onPress={() => handleOrgAction(item._id, item.role, 'reject')}>
          <Text style={styles.btnText}>REJECT</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  const renderDonation = ({ item }) => (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.name, { color: theme.text }]}>{item.book?.title}</Text>
          <Text style={[styles.role, { color: theme.primary }]}>DONATED BY: {item.donor?.name}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={[styles.detail, { color: theme.muted }]}>📚 Author: {item.book?.author}</Text>
        <Text style={[styles.detail, { color: theme.muted }]}>📍 Pickup: {item.pickupLocation}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.success }]} onPress={() => handleDonationAction(item._id, 'approve')}>
          <Text style={styles.btnText}>APPROVE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.danger }]} onPress={() => handleDonationAction(item._id, 'reject')}>
          <Text style={styles.btnText}>REJECT</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  return (
    <GlassScreen>
      <View style={styles.container}>
        <AppHeader title="Admin Approvals" icon="🛡️" />

        <View style={styles.tabs}>
           <TouchableOpacity onPress={() => setActiveTab('orgs')} style={[styles.tab, activeTab === 'orgs' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}>
             <Text style={[styles.tabText, { color: activeTab === 'orgs' ? theme.primary : theme.text }]}>Organizations</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={() => setActiveTab('donations')} style={[styles.tab, activeTab === 'donations' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}>
             <Text style={[styles.tabText, { color: activeTab === 'donations' ? theme.primary : theme.text }]}>Donations</Text>
           </TouchableOpacity>
        </View>

        {loading ? <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 50 }} /> : (
          <FlatList
            data={activeTab === 'orgs' ? items : donations}
            keyExtractor={item => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={<Text style={[styles.empty, { color: theme.muted }]}>No pending items found.</Text>}
            renderItem={activeTab === 'orgs' ? renderOrg : renderDonation}
          />
        )}
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  tabs: { flexDirection: 'row', gap: 20, marginBottom: 15, paddingHorizontal: 5 },
  tab: { paddingVertical: 8 },
  tabText: { fontSize: 14, fontWeight: '800' },
  card: { padding: 18, marginVertical: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 17, fontWeight: '900' },
  role: { fontSize: 11, fontWeight: '800', marginTop: 3 },
  details: { marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(150,150,150,0.1)', paddingTop: 10 },
  detail: { fontSize: 12, marginVertical: 1 },
  actions: { flexDirection: 'row', marginTop: 16, gap: 10 },
  btn: { flex: 1, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 15, fontWeight: '600' }
});
