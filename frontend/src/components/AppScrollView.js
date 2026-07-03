import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

export default function AppScrollView({ children, contentContainerStyle }) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const [containerHeight, setContainerHeight] = useState(1);
  const [contentHeight, setContentHeight] = useState(1);

  const showScrollbar = contentHeight > containerHeight;

  const thumbHeight = showScrollbar
    ? Math.max((containerHeight * containerHeight) / contentHeight, 44)
    : 0;

  const maxScroll = Math.max(contentHeight - containerHeight, 1);
  const maxThumbTop = Math.max(containerHeight - thumbHeight, 1);

  const thumbTranslateY = scrollY.interpolate({
    inputRange: [0, maxScroll],
    outputRange: [0, maxThumbTop],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onLayout={(event) => {
          setContainerHeight(event.nativeEvent.layout.height);
        }}
        onContentSizeChange={(width, height) => {
          setContentHeight(height);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {children}
      </Animated.ScrollView>

      {showScrollbar && (
        <View style={styles.scrollbarTrack}>
          <Animated.View
            style={[
              styles.scrollbarThumb,
              {
                height: thumbHeight,
                transform: [{ translateY: thumbTranslateY }],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: Platform.OS === 'web' ? 40 : 110,
    paddingRight: 14,
  },
  scrollbarTrack: {
    position: 'absolute',
    top: 14,
    right: 4,
    bottom: 14,
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
  },
  scrollbarThumb: {
    width: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
});