import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import GlassCard from './GlassCard';
import AppButton from './AppButton';
import { useThemeMode } from '../context/ThemeContext';

export default function AppHeader({
  label,
  title,
  subtitle,
  icon = '📚',
  showThemeButton = false,
}) {
  const { theme, themeMode, toggleTheme } = useThemeMode();

  return (
    <GlassCard style={styles.header}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={styles.textBox}>
          {label ? (
            <Text style={[styles.label, { color: theme.muted }]}>
              {label}
            </Text>
          ) : null}

          <Text style={[styles.title, { color: theme.white }]}>
            {title}
          </Text>

          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {showThemeButton && (
        <AppButton
          title={themeMode === 'dark' ? 'Light Theme' : 'Dark Theme'}
          variant="gold"
          onPress={toggleTheme}
        />
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 66,
    height: 66,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 34,
  },
  textBox: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '600',
  },
});