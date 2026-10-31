import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

export default function BentoCard({
  title,
  subtitle,
  icon,
  onPress,
  colors, // Array of colors for gradient
  style,
  size = 'small' // 'small', 'medium', 'large'
}) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  const getWidth = () => {
    if (size === 'large') return '100%';
    if (size === 'medium') return '58%';
    return '38%'; // small
  };

  const getHeight = () => {
    if (size === 'large') return 120;
    return 160;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.container,
        {
          width: getWidth(),
          height: getHeight(),
          backgroundColor: isLight ? '#fff' : theme.backgroundTwo,
          borderColor: theme.glassBorder,
          shadowColor: colors ? colors[0] : theme.primary,
        },
        style
      ]}
    >
      <LinearGradient
        colors={colors || [theme.primary, theme.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconBackground}
      >
        <Text style={styles.iconText}>{icon}</Text>
      </LinearGradient>

      <View style={styles.textContent}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]} numberOfLines={2}>{subtitle}</Text>
      </View>

      <View style={[styles.arrowCircle, { borderColor: theme.glassBorder }]}>
         <Text style={{ color: theme.primary, fontSize: 10 }}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  iconBackground: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  textContent: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 14,
  },
  arrowCircle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
