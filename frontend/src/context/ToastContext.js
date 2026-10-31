import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useThemeMode } from './ThemeContext';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const { theme } = useThemeMode();
  const [toast, setToast] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -100, duration: 250, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setToast(null);
    });
  }, [slideAnim, opacityAnim]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, type });

    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    timerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [slideAnim, opacityAnim, hideToast]);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getToastColor = (type) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'info':
      default:
        return theme.primary;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast && (
          <SafeAreaView pointerEvents="box-none" style={styles.toastContainer}>
            <Animated.View
              style={[
                styles.toastBox,
                {
                  backgroundColor: theme.tabBg,
                  borderColor: getToastColor(toast.type),
                  transform: [{ translateY: slideAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <View style={[styles.typePill, { backgroundColor: getToastColor(toast.type) + '20' }]}>
                <Text style={styles.toastIcon}>{getToastIcon(toast.type)}</Text>
              </View>
              <Text style={[styles.toastText, { color: theme.text }]} numberOfLines={2}>
                {toast.message}
              </Text>
              <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
                <Text style={[styles.closeText, { color: theme.muted }]}>✕</Text>
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg) => console.log('Toast:', msg),
      hideToast: () => {},
    };
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 99999,
    alignItems: 'center',
  },
  toastBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 440,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  typePill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toastIcon: {
    fontSize: 16,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 8,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
