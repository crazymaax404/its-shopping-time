import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/core/providers/AuthProvider';
import { colors } from '@/theme';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const displayName =
    user?.email?.split('@')[0] || user?.user_metadata?.name || 'usuário';

  const handleUserPress = () => {
    Alert.alert(displayName, user?.email ?? '', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.left}>
        <View style={styles.logo}>
          <Ionicons name="bag-handle" size={18} color="#fff" />
        </View>
        <Text style={styles.brand}>Nossa Listinha</Text>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
        </View>
        <View style={styles.dbBtn}>
          <Ionicons name="server-outline" size={14} color={colors.primary} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.userPill}
        onPress={handleUserPress}
        activeOpacity={0.85}
      >
        <Ionicons name="person" size={14} color="#fff" />
        <Text style={styles.userText} numberOfLines={1}>
          {displayName}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statusPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  dbBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: 140,
  },
  userText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
