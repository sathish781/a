import React from 'react';
import { Text, StyleSheet } from 'react-native';

import GlassCard from './GlassCard';
import { colors } from '../utils/theme';

export default function EmptyState({ title = 'No data found', message = 'Try again later.' }) {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 30
  },
  icon: {
    fontSize: 44,
    marginBottom: 8
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900'
  },
  message: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 5
  }
});