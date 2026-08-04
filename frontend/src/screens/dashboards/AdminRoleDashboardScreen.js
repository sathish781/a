import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';

function AdminCard({ icon, title, text, button, onPress }) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardText}>{text}</Text>
      <AppButton title={button} onPress={onPress} style={{ marginTop: 8 }} />
    </GlassCard>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function AdminRoleDashboardScreen({ navigation }) {
  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greet}>SYSTEM CONTROL PANEL</Text>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>

        <Text style={styles.sectionTitle}>Overview Statistics</Text>
        <GlassCard style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard label="Users" value="250+" />
            <StatCard label="Books" value="1.2k" />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Libraries" value="12" />
            <StatCard label="Shops" value="18" />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Donations" value="84" />
            <StatCard label="Exchanges" value="142" />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Management Modules</Text>
        
        <AdminCard icon="👥" title="User Management" text="View, delete, block users, reset passwords, assign roles." button="MANAGE USERS" onPress={() => {}} />
        <AdminCard icon="🏪" title="Shop Owner Management" text="Approve/reject shops, view inventory, sales reports." button="MANAGE SHOPS" onPress={() => {}} />
        <AdminCard icon="🏛️" title="Library Management" text="Approve libraries, manage books, view reservation & borrow reports." button="MANAGE LIBRARIES" onPress={() => {}} />
        <AdminCard icon="📚" title="Book Management" text="All books, add, delete, update, manage categories." button="MANAGE BOOKS" onPress={() => {}} />
        <AdminCard icon="🛒" title="Marketplace Control" text="All listings, approve listings, remove flagged listings." button="MANAGE MARKET" onPress={() => {}} />
        <AdminCard icon="🎁" title="Donation Management" text="All donations, approve, reject, delete." button="MANAGE DONATIONS" onPress={() => {}} />
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 16,
  },
  greet: {
    color: '#6366f1',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  statsContainer: {
    padding: 18,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#6366f1',
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  card: {
    padding: 18,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#090a14',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 22,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  cardText: {
    color: '#94a3b8',
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 20,
    fontSize: 13,
    fontWeight: '500',
  },
});