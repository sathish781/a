import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

import GlassScreen from '../../components/GlassScreen';
import GlassCard from '../../components/GlassCard';
import AppButton from '../../components/AppButton';
import { colors } from '../../utils/theme';

function ShopCard({ icon, title, text, button, onPress }) {
  return (
    <GlassCard>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <AppButton title={button} onPress={onPress} />
    </GlassCard>
  );
}

export default function ShopDashboardScreen({ navigation }) {
  return (
    <GlassScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greet}>Local Shop Owner Panel</Text>
        <Text style={styles.title}>Shop Management</Text>

        <ShopCard
          icon="🏪"
          title="Register Shop"
          text="Create your local book shop with address and contact."
          button="Open Shop Panel"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="📦"
          title="Update Stock"
          text="Add available books and maintain current stock."
          button="Manage Stock"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="💰"
          title="Update Price"
          text="Set book prices. App compares prices between nearby shops."
          button="Update Price"
          onPress={() => navigation.navigate('ShopPanel')}
        />

        <ShopCard
          icon="📍"
          title="Nearby Discovery"
          text="Students can find your shop based on local area."
          button="Coming Soon"
          onPress={() => {}}
        />
      </ScrollView>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 100,
  },
  greet: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 16,
  },
  title: {
    color: colors.white,
    fontSize: 31,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 16,
  },
  icon: {
    fontSize: 38,
    marginBottom: 8,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  cardText: {
    color: colors.muted,
    marginTop: 6,
    marginBottom: 10,
    lineHeight: 21,
  },
});