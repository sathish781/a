import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import GlassCard from './GlassCard';
import { colors } from '../utils/theme';

export default function BookListItem({ item, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <GlassCard>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📘</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.author || 'Unknown Author'}</Text>

            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{item.examType || 'Academic'}</Text>
              <Text style={styles.badge}>{item.category || 'Book'}</Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14
  },
  icon: {
    fontSize: 26
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.muted,
    marginTop: 4
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    color: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '700'
  }
});