import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import AnimatedBackground from '../components/animations/AnimatedBackground';
import GlowOrb from '../components/animations/GlowOrb';
import PageIndicator from '../components/animations/PageIndicator';
import AnimatedButton from '../components/animations/AnimatedButton';
import { useThemeMode } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const ONBOARDING_PAGES = [
  {
    id: '1',
    badge: 'ECOSYSTEM',
    title: 'The Smarter Way to\nFind Campus Books',
    description: 'Unifying institutional libraries, local bookshops,\nand peer-to-peer listings in one ecosystem.',
    icon: '📚',
  },
  {
    id: '2',
    badge: 'DISCOVERY',
    title: 'Discover Books\nNear Your Campus',
    description: 'Find required textbooks and study materials\nfrom nearby students and verified store owners.',
    icon: '📍',
  },
  {
    id: '3',
    badge: 'EXCHANGE HUB',
    title: 'Swap, Sell &\nDonate Seamlessly',
    description: 'Exchange unwanted books, list items for sale,\nor gift books to peers in your academic community.',
    icon: '🔁',
  },
  {
    id: '4',
    badge: 'CONNECT',
    title: 'Connect With\nYour Campus',
    description: 'Real-time messaging, instant order alerts,\nand unified library borrowing management.',
    icon: '🎓',
  },
];

export default function SplashScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollX] = useState(new Animated.Value(0));
  const scrollRef = useRef(null);

  // Parallel Launch Animations
  const bgFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const taglineTranslate = useRef(new Animated.Value(15)).current;
  const headingTranslate = useRef(new Animated.Value(20)).current;
  const headingFade = useRef(new Animated.Value(0)).current;
  const btnSlide = useRef(new Animated.Value(20)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel Entrance for instant responsivity
    Animated.parallel([
      Animated.timing(bgFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
      Animated.timing(taglineFade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(taglineTranslate, { toValue: 0, duration: 450, useNativeDriver: true }),
      Animated.timing(headingFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(headingTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(btnFade, { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.timing(btnSlide, { toValue: 0, duration: 550, useNativeDriver: true }),
    ]).start();

    // Floating logo animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -6, duration: 1600, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleNextPage = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      const nextIdx = currentPage + 1;
      scrollRef.current?.scrollTo({ x: nextIdx * width, animated: true });
      setCurrentPage(nextIdx);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <AnimatedBackground intensity="full" parallaxOffset={scrollX} style={styles.flexFill}>
      <View style={styles.flexFill}>
        <Animated.View style={[styles.container, { opacity: bgFade }]}>

          {/* Top Section: Perfectly Centered Logo, Orbit & Tagline */}
          <Animated.View
            style={[
              styles.topSection,
              { transform: [{ scale: logoScale }, { translateY: logoFloat }] },
            ]}
          >
            <GlowOrb>
              <View style={[styles.glowContainer, { shadowColor: theme.primary }]}>
                <LinearGradient
                  colors={[theme.primary, theme.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoCircle}
                >
                  <Text style={styles.logoIcon}>
                    {ONBOARDING_PAGES[currentPage]?.icon || '📚'}
                  </Text>
                </LinearGradient>
              </View>
            </GlowOrb>

            <Text style={[styles.appName, { color: theme.text }]}>BookConnect</Text>

            {/* Perfectly Aligned Tagline Badge */}
            <Animated.View
              style={[
                styles.taglineBadge,
                {
                  backgroundColor: theme.primary + '12',
                  borderColor: theme.primary + '35',
                  opacity: taglineFade,
                  transform: [{ translateY: taglineTranslate }],
                },
              ]}
            >
              <Text style={[styles.tagline, { color: theme.primary }]}>
                KNOWLEDGE SHARED • SUCCESS MULTIPLIED
              </Text>
            </Animated.View>
          </Animated.View>

          {/* Center Section: Onboarding Slider */}
          <Animated.View
            style={[
              styles.sliderSection,
              { opacity: headingFade, transform: [{ translateY: headingTranslate }] },
            ]}
          >
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ flexGrow: 0, height: 105 }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(e) => {
                const newIdx = Math.round(e.nativeEvent.contentOffset.x / width);
                if (newIdx >= 0 && newIdx < ONBOARDING_PAGES.length) {
                  setCurrentPage(newIdx);
                }
              }}
            >
              {ONBOARDING_PAGES.map((item) => (
                <View key={item.id} style={styles.slideCard}>
                  <Text style={[styles.mainTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.description, { color: theme.muted }]}>{item.description}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Page Indicator */}
            <PageIndicator
              totalPages={ONBOARDING_PAGES.length}
              currentPage={currentPage}
              onPageSelect={(idx) => {
                scrollRef.current?.scrollTo({ x: idx * width, animated: true });
                setCurrentPage(idx);
              }}
            />
          </Animated.View>

          {/* Action Footer */}
          <Animated.View
            style={[
              styles.footer,
              { opacity: btnFade, transform: [{ translateY: btnSlide }] },
            ]}
          >
            {/* GET STARTED Primary Button with Moving Shine Sweep */}
            <AnimatedButton
              title={currentPage === ONBOARDING_PAGES.length - 1 ? 'GET STARTED' : 'CONTINUE'}
              onPress={handleNextPage}
              variant="primary"
            />

            {/* CREATE AN ACCOUNT Glass Secondary Button */}
            <AnimatedButton
              title="CREATE AN ACCOUNT"
              onPress={() => navigation.navigate('Register')}
              variant="glass"
            />

            <Text style={[styles.versionText, { color: theme.muted }]}>
              PROUDLY SERVING UNIVERSITY STUDENTS v2.0
            </Text>
          </Animated.View>

        </Animated.View>
      </View>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 28) + 12 : 44,
    paddingBottom: Platform.OS === 'ios' ? 30 : 25,
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  glowContainer: {
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 42,
    textAlign: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 10,
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  taglineBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: 8,
    alignSelf: 'center',
  },
  tagline: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  sliderSection: {
    alignItems: 'center',
    marginVertical: 4,
    width: '100%',
  },
  slideCard: {
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    fontWeight: '500',
    opacity: 0.85,
  },
  footer: {
    gap: 8,
    marginBottom: 10,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
    opacity: 0.5,
  },
});
