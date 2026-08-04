import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import GlassCard from './GlassCard';

import { useThemeMode } from '../context/ThemeContext';

export default function AppHeader({
  label,
  title,
  subtitle,
  icon = '📚',
}) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  return (
    <GlassCard style={styles.header}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: isLight ? '#f8fafc' : '#090a14', borderColor: theme.primary }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={styles.textBox}>
          {label ? (
            <Text style={[styles.label, { color: theme.primary }]}>
              {label}
            </Text>
          ) : null}

          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>

          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 18,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#dc2626',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 30,
  },
  textBox: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    lineHeight: 18,
    fontSize: 13,
    fontWeight: '500',
  },
});