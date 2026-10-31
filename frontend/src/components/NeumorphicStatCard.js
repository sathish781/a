import React from 'react';
import { Text, StyleSheet } from 'react-native';
import NeumorphicCard from './NeumorphicCard';
import AnimatedNumber from './AnimatedNumber';
import { useThemeMode } from '../context/ThemeContext';

export default function NeumorphicStatCard({ label, value, icon }) {
  const { theme } = useThemeMode();

  return (
    <NeumorphicCard style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <AnimatedNumber value={value} style={[styles.value, { color: theme.white }]} />
      <Text style={[styles.label, { color: theme.muted }]}>{label}</Text>
    </NeumorphicCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '46%',
    minHeight: 120,
    padding: 16,
    marginVertical: 8,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  value: {
    fontSize: 26,
    fontWeight: '900',
  },
  label: {
    marginTop: 4,
    fontWeight: '700',
    fontSize: 12,
  },
});
