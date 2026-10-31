import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';

function SingleDot({ isActive, onPress }) {
  const { theme } = useThemeMode();
  const widthAnim = useRef(new Animated.Value(isActive ? 28 : 8)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: isActive ? 28 : 8,
      tension: 65,
      friction: 6,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: widthAnim,
            backgroundColor: isActive ? theme.primary : theme.muted + '40',
            shadowColor: isActive ? theme.primary : 'transparent',
            shadowOpacity: isActive ? 0.8 : 0,
            shadowRadius: isActive ? 6 : 0,
            elevation: isActive ? 4 : 0,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

export default function PageIndicator({ totalPages = 4, currentPage = 0, onPageSelect }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, idx) => (
        <SingleDot
          key={idx}
          isActive={idx === currentPage}
          onPress={() => onPageSelect && onPageSelect(idx)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 14,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
