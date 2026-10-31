import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';

export function SkeletonBox({ width = '100%', height = 20, borderRadius = 10, style }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
          opacity: shimmerAnim,
        },
        style,
      ]}
    />
  );
}

export function BookCardSkeleton() {
  const { theme } = useThemeMode();
  return (
    <View style={[styles.card, { backgroundColor: theme.tabBg, borderColor: theme.glassBorder }]}>
      <SkeletonBox width={100} height={120} borderRadius={14} style={{ marginRight: 16 }} />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <SkeletonBox width="80%" height={18} borderRadius={8} style={{ marginBottom: 10 }} />
        <SkeletonBox width="55%" height={14} borderRadius={6} style={{ marginBottom: 12 }} />
        <SkeletonBox width="40%" height={16} borderRadius={8} />
      </View>
    </View>
  );
}

export function StatCardSkeleton() {
  const { theme } = useThemeMode();
  return (
    <View style={[styles.statCard, { backgroundColor: theme.tabBg, borderColor: theme.glassBorder }]}>
      <SkeletonBox width={36} height={36} borderRadius={18} style={{ marginBottom: 10 }} />
      <SkeletonBox width={50} height={22} borderRadius={8} style={{ marginBottom: 6 }} />
      <SkeletonBox width={60} height={12} borderRadius={6} />
    </View>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <View style={{ width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 14,
    alignItems: 'center',
  },
  statCard: {
    width: 110,
    height: 115,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    padding: 10,
  },
});
