import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { radius } from '../utils/theme';

export default function AppButton({ title, onPress, variant = 'primary' }) {
  const gradientColors =
    variant === 'danger'
      ? ['#FB7185', '#DC2626']
      : variant === 'success'
      ? ['#4ADE80', '#15803D']
      : variant === 'dark'
      ? ['#475569', '#0F172A']
      : variant === 'gold'
      ? ['#FACC15', '#D97706']
      : variant === 'purple'
      ? ['#C084FC', '#7C3AED']
      : ['#38BDF8', '#2563EB'];

  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress}>
      <LinearGradient colors={gradientColors} style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 7,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});