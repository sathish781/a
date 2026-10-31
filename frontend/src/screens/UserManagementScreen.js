import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppHeader from '../components/AppHeader';
import api from '../api/client';
import { useThemeMode } from '../context/ThemeContext';

export default function UserManagementScreen() {
  const { theme } = useThemeMode();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.log('Load users error:', error);
      Alert.alert('Error', 'Could not fetch users list.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleToggleBlock(userId, currentStatus) {
    try {
      const res = await api.patch(`/admin/users/${userId}/block`);
      Alert.alert('Success', res.data.message);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', 'Action failed');
    }
  }

  async function handleAssignRole(userId, currentRole) {
    Alert.alert('Assign Role', `Current role: ${currentRole}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Student', onPress: () => updateRole(userId, 'student') },
      { text: 'Shop', onPress: () => updateRole(userId, 'shop') },
      { text: 'Library', onPress: () => updateRole(userId, 'library') },
      { text: 'Admin', onPress: () => updateRole(userId, 'admin') },
    ]);
  }

  async function updateRole(userId, role) {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      Alert.alert('Success', `Role updated to ${role}`);
      loadUsers();
    } catch (error) {
      Alert.alert('Error', 'Could not update role.');
    }
  }

  async function handleDelete(userId) {
    Alert.alert('Delete User', 'Are you sure you want to permanently remove this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/admin/users/${userId}`);
            Alert.alert('Success', 'User deleted.');
            loadUsers();
          } catch (error) {
            Alert.alert('Error', 'Could not delete user.');
          }
        },
      },
    ]);
  }

  if (loading && users.length === 0) {
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
          title="User & Access Control"
          subtitle={`Managing ${users.length} registered accounts`}
          icon="👥"
        />

        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          onRefresh={loadUsers}
          refreshing={loading}
          renderItem={({ item }) => (
            <GlassCard style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.userEmail, { color: theme.muted }]}>{item.email}</Text>
                  <View style={styles.roleBadgeContainer}>
                    <View style={[styles.roleBadge, { backgroundColor: theme.primary }]}>
                      <Text style={styles.roleBadgeText}>{item.role.toUpperCase()}</Text>
                    </View>
                    {item.status === 'blocked' && (
                      <View style={[styles.roleBadge, { backgroundColor: theme.danger, marginLeft: 6 }]}>
                        <Text style={styles.roleBadgeText}>BLOCKED</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <Text style={[styles.detailText, { color: theme.muted }]}>
                  📍 {item.location || 'N/A'}
                </Text>
                {item.phone ? (
                  <Text style={[styles.detailText, { color: theme.muted }]}>
                    📞 {item.phone}
                  </Text>
                ) : null}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: theme.glassBorder }]}
                  onPress={() => handleAssignRole(item._id, item.role)}
                >
                  <Text style={[styles.actionBtnText, { color: theme.primary }]}>Role</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: theme.glassBorder }]}
                  onPress={() => handleToggleBlock(item._id, item.status)}
                >
                  <Text style={[styles.actionBtnText, { color: theme.primary }]}>
                    {item.status === 'blocked' ? 'Unblock' : 'Block'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: theme.glassBorder }]}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={[styles.actionBtnText, { color: theme.danger }]}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    padding: 16,
    marginVertical: 8,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  detailsGrid: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.1)',
    paddingTop: 10,
  },
  detailText: {
    fontSize: 12,
    marginVertical: 1,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
