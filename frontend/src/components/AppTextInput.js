import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { radius } from '../utils/theme';
import { useThemeMode } from '../context/ThemeContext';

export default function AppTextInput(props) {
  const { theme } = useThemeMode();

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: theme.white,
          borderColor: theme.glassBorder,
          backgroundColor:
            theme.mode === 'dark'
              ? 'rgba(255,255,255,0.13)'
              : 'rgba(255,255,255,0.72)',
        },
        props.multiline && styles.multiline,
      ]}
      placeholderTextColor={
        theme.mode === 'dark'
          ? 'rgba(255,255,255,0.68)'
          : 'rgba(15,23,42,0.50)'
      }
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    marginVertical: 7,
    fontWeight: '700',
  },
  multiline: {
    minHeight: 95,
    textAlignVertical: 'top',
  },
});