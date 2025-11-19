import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { styles } from './styles';
import { Image } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const colors = useThemeColors();

  const [email, setEmail] = useState('admin@levelup.com');
  const [password, setPassword] = useState('admin123');

  const handleLogin = async () => {
    await login(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderWidth: 0,
            borderColor: 'transparent'
          }
        ]}
      >
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 300, height: 200, alignSelf: 'center', marginBottom: 20 }}
          resizeMode="contain"
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="E-mail"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Admin padrão: admin@levelup.com / admin123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
