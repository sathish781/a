import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

export default function NeumorphicCard({ children, style }) {
  const { theme } = useThemeMode();
  const isDark = theme.mode === 'dark';

  // Neumorphic raised card shadow colors
  const bgCard = isDark ? '#1a2235' : '#ffffff';
  const shadowLight = isDark ? '#232f47' : '#ffffff';
  const shadowDark = isDark ? '#0e1420' : 'rgba(15, 23, 42, 0.08)';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bgCard,
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)',
          // iOS double shadow (highlight + shadow)
          shadowColor: shadowDark,
          shadowOpacity: Platform.OS === 'ios' ? 0.7 : 0,
          shadowRadius: 18,
          shadowOffset: { width: 8, height: 8 },
          // Android elevation
          elevation: Platform.OS === 'android' ? 10 : 0,
        },
        style,
      ]}
    >
      {/* Inner highlight layer (top-left) for iOS */}
      {Platform.OS === 'ios' && (
        <View
          pointerEvents="none"
          style={[
            styles.highlightLayer,
            {
              shadowColor: shadowLight,
              shadowOpacity: 0.9,
              shadowRadius: 18,
              shadowOffset: { width: -8, height: -8 },
            },
          ]}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '90%',
    maxWidth: 400,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 28,
    marginVertical: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  highlightLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.lg,
  },
});
