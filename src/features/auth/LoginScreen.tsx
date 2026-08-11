import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/core/providers/AuthProvider';
import { Button, Input } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Ionicons name="bag-handle" size={36} color="#fff" />
        </View>
        <Text style={styles.appName}>Nossa Listinha</Text>
      </View>

      <View style={styles.formContainer}>
        {!!error && <Text style={styles.error}>{error}</Text>}

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          disabled={loading}
        />

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
          autoComplete="password"
          disabled={loading}
        />

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={{ marginTop: 8 }}
        />
      </View>

      <Text style={styles.hint}>
        Contas são criadas diretamente no Supabase Dashboard
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
  formContainer: {
    width: '100%',
    gap: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    marginTop: 24,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
  },
});
