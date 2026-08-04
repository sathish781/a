import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';
import { radius } from '../utils/theme';

export default function NeumorphicInput(props) {
  const { theme } = useThemeMode();
  const isDark = theme.mode === 'dark';
  const [isFocused, setIsFocused] = useState(false);

  // Neumorphic recessed input colors
  const bgInput = isDark ? '#141a29' : '#e0eaf5';
  const shadowLight = isDark ? '#232f47' : '#ffffff';
  const shadowDark = isDark ? '#0e1420' : '#b8c8da';

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: bgInput,
          borderColor: isFocused
            ? theme.primary
            : isDark
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(0,0,0,0.06)',
          borderWidth: isFocused ? 1.5 : 1,
          // Inset shadow simulation with outer shadow on container
          shadowColor: isFocused ? theme.primary : shadowDark,
          shadowOpacity: Platform.OS === 'ios' ? (isFocused ? 0.5 : 0.4) : 0,
          shadowRadius: isFocused ? 8 : 6,
          shadowOffset: { width: 3, height: 3 },
          elevation: Platform.OS === 'android' ? 2 : 0,
        },
      ]}
    >
      {/* Inner top-left highlight */}
      {Platform.OS === 'ios' && !isFocused && (
        <View
          pointerEvents="none"
          style={[
            styles.inputHighlight,
            {
              shadowColor: shadowLight,
              shadowOpacity: 0.7,
              shadowRadius: 6,
              shadowOffset: { width: -3, height: -3 },
            },
          ]}
        />
      )}
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          {
            color: isDark ? '#e2e8f0' : '#0f172a',
          },
        ]}
        placeholderTextColor={isDark ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.6)'}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
    marginVertical: 7,
    position: 'relative',
    overflow: 'hidden',
  },
  inputHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 15,
    fontWeight: '600',
    minHeight: 52,
  },
});
