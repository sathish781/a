import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CARDS = [
  { emoji: '📚', label: 'BookConnect', gradient: ['#6366f1', '#8b5cf6'], rotation: '-4deg' },
  { emoji: '🎓', label: 'Campus Exchange', gradient: ['#0ea5e9', '#38bdf8'], rotation: '3deg' },
  { emoji: '🛒', label: 'Buy & Sell', gradient: ['#f97316', '#fb923c'], rotation: '-2deg' },
  { emoji: '🏛️', label: 'Library Access', gradient: ['#10b981', '#34d399'], rotation: '5deg' },
  { emoji: '🔍', label: 'Find Books', gradient: ['#ec4899', '#f472b6'], rotation: '-3deg' },
  { emoji: '💬', label: 'Connect', gradient: ['#f59e0b', '#fbbf24'], rotation: '2deg' },
  { emoji: '⭐', label: 'Reviews', gradient: ['#8b5cf6', '#a78bfa'], rotation: '-5deg' },
  { emoji: '🔖', label: 'Bookmark', gradient: ['#06b6d4', '#22d3ee'], rotation: '4deg' },
  { emoji: '📖', label: 'Read More', gradient: ['#ef4444', '#f87171'], rotation: '-1deg' },
  { emoji: '🎒', label: 'Student Hub', gradient: ['#3b82f6', '#60a5fa'], rotation: '3deg' },
  { emoji: '💡', label: 'Knowledge', gradient: ['#84cc16', '#a3e635'], rotation: '-4deg' },
  { emoji: '🤝', label: 'Share', gradient: ['#f43f5e', '#fb7185'], rotation: '2deg' },
];

function MosaicCard({ card, delay }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: card.gradient[0],
          transform: [
            { rotate: card.rotation },
            { translateY },
          ],
          opacity,
        },
      ]}
    >
      <Text style={styles.cardEmoji}>{card.emoji}</Text>
      <Text style={styles.cardLabel} numberOfLines={1}>{card.label}</Text>
      {/* Gradient overlay shimmer */}
      <View
        style={[
          styles.cardShimmer,
          { backgroundColor: card.gradient[1] + '55' },
        ]}
      />
    </Animated.View>
  );
}

export default function GammaMosaicPanel() {
  const columns = [
    CARDS.slice(0, 4),
    CARDS.slice(4, 8),
    CARDS.slice(8, 12),
  ];

  return (
    <View style={styles.container}>
      {/* Gradient overlay at the left edge for fade */}
      <View style={styles.fadeLeft} />
      <View style={styles.grid}>
        {columns.map((col, colIdx) => (
          <View
            key={colIdx}
            style={[
              styles.column,
              colIdx === 1 && styles.columnOffset,
            ]}
          >
            {col.map((card, cardIdx) => (
              <MosaicCard
                key={cardIdx}
                card={card}
                delay={colIdx * 100 + cardIdx * 80}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const CARD_W = 110;
const CARD_H = 90;
const CARD_GAP = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  fadeLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 40,
    zIndex: 10,
    backgroundColor: 'transparent',
    // Simulated left fade using a semi-transparent overlay
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: CARD_GAP,
  },
  column: {
    flex: 1,
    gap: CARD_GAP,
    alignItems: 'center',
  },
  columnOffset: {
    marginTop: 30,
  },
  card: {
    width: CARD_W,
    borderRadius: 16,
    padding: 12,
    minHeight: CARD_H,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    // Subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },
  cardShimmer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
