import React from 'react';
import { Text, StyleSheet } from 'react-native';

import GlassCard from './GlassCard';
import { colors } from '../utils/theme';

export default function StatCard({ label, value, icon }) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 120
  },
  icon: {
    fontSize: 28,
    marginBottom: 8
  },
  value: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900'
  },
  label: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700'
  }
});