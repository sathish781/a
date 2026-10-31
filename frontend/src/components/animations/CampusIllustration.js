import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Text, Dimensions } from 'react-native';
import { useThemeMode } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CampusIllustration({ parallaxOffset = 0 }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  // Window glow pulse
  const windowGlow = useRef(new Animated.Value(0.4)).current;
  const treeSway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Window pulse
    const windowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(windowGlow, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(windowGlow, { toValue: 0.4, duration: 2500, useNativeDriver: true }),
      ])
    );
    windowLoop.start();

    // Tree sway
    const treeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(treeSway, { toValue: 4, duration: 3000, useNativeDriver: true }),
        Animated.timing(treeSway, { toValue: -4, duration: 3000, useNativeDriver: true }),
      ])
    );
    treeLoop.start();

    return () => {
      windowLoop.stop();
      treeLoop.stop();
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.skylineRow,
          {
            transform: [{ translateX: parallaxOffset }],
          },
        ]}
      >
        {/* Left Campus Tree */}
        <Animated.Text style={[styles.campusIcon, { transform: [{ translateX: treeSway }] }]}>
          🌳
        </Animated.Text>

        {/* University Main Building */}
        <View style={styles.buildingWrap}>
          <Text style={styles.buildingEmoji}>🏛️</Text>
          <Animated.View
            style={[
              styles.glowingWindow,
              {
                backgroundColor: theme.primary,
                opacity: windowGlow,
                shadowColor: theme.primary,
              },
            ]}
          />
        </View>

        {/* Campus Street Light */}
        <Text style={styles.campusIcon}>💡</Text>

        {/* Library Building */}
        <View style={styles.buildingWrap}>
          <Text style={styles.buildingEmoji}>📚</Text>
          <Animated.View
            style={[
              styles.glowingWindow,
              {
                backgroundColor: theme.accent || '#f59e0b',
                opacity: windowGlow,
                shadowColor: theme.accent || '#f59e0b',
              },
            ]}
          />
        </View>

        {/* Student Peer */}
        <Text style={styles.campusIcon}>🎓</Text>

        {/* Right Campus Tree */}
        <Animated.Text style={[styles.campusIcon, { transform: [{ translateX: treeSway }] }]}>
          🌳
        </Animated.Text>
      </Animated.View>

      {/* Ground Road Line */}
      <View
        style={[
          styles.groundLine,
          { backgroundColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)' },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 4,
  },
  skylineRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    width: width,
    paddingHorizontal: 20,
  },
  campusIcon: {
    fontSize: 22,
    opacity: 0.85,
  },
  buildingWrap: {
    position: 'relative',
    alignItems: 'center',
  },
  buildingEmoji: {
    fontSize: 32,
    opacity: 0.9,
  },
  glowingWindow: {
    position: 'absolute',
    bottom: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  groundLine: {
    width: '90%',
    height: 1.5,
    borderRadius: 1,
    marginTop: 4,
  },
});
