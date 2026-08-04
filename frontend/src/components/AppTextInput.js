import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { radius } from '../utils/theme';
import { useThemeMode } from '../context/ThemeContext';

export default function AppTextInput(props) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={[
        styles.input,
        {
          backgroundColor: isLight ? '#f8fafc' : '#090a14',
          borderColor: isFocused ? theme.primary : (isLight ? 'rgba(226, 232, 240, 0.9)' : 'rgba(255, 0, 60, 0.25)'),
          color: theme.text,
        },
        isFocused && {
          shadowColor: theme.primary,
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 3,
        },
        props.multiline && styles.multiline,
        props.style,
      ]}
      placeholderTextColor={isLight ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginVertical: 6,
    fontWeight: '500',
    minHeight: 52,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});