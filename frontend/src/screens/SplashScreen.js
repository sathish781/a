import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import GlassScreen from '../components/GlassScreen';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/AppButton';
import { colors } from '../utils/theme';

export default function SplashScreen({ navigation }) {
  return (
    <GlassScreen>
      <View style={styles.container}>
        <Text style={styles.logo}>📚</Text>

        <Text style={styles.title}>BookConnect</Text>

        <Text style={styles.subtitle}>
          One Search, Three Sources – Library, Local Book Shop, and Student Marketplace.
        </Text>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Find Books Smarter</Text>

          <Text style={styles.cardText}>
            Search academic and competitive exam books from libraries, local shops,
            and students in one modern app.
          </Text>

          <AppButton
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />

          <AppButton
            title="Create Account"
            variant="dark"
            onPress={() => navigation.navigate('Register')}
          />
        </GlassCard>
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: 'center'
  },
  logo: {
    fontSize: 82,
    textAlign: 'center'
  },
  title: {
    fontSize: 42,
    color: colors.white,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 24
  },
  card: {
    marginTop: 12
  },
  cardTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6
  },
  cardText: {
    color: colors.muted,
    lineHeight: 22,
    marginBottom: 12
  }
});