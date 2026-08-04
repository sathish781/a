import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import GlassCard from './GlassCard';
import { useThemeMode } from '../context/ThemeContext';

export default function BookListItem({ item, onPress }) {
  const { theme } = useThemeMode();
  const isLight = theme.mode === 'light';

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <GlassCard>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)' }]}>
            <Text style={styles.icon}>📘</Text>
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.subtitle, { color: theme.muted }]}>{item.author || 'Unknown Author'}</Text>

            <View style={styles.badgeRow}>
              <Text style={[styles.badge, { backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.14)', color: theme.text, borderColor: theme.glassBorder }]}>
                {item.examType || 'Academic'}
              </Text>
              <Text style={[styles.badge, { backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.14)', color: theme.text, borderColor: theme.glassBorder }]}>
                {item.category || 'General'}
              </Text>
              {item.price > 0 ? (
                <Text style={[styles.badge, { backgroundColor: theme.primary, color: '#ffffff', borderColor: theme.primary }]}>
                  ₹{item.price}
                </Text>
              ) : null}
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
    fontSize: 17,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: 4
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: '700'
  }
});