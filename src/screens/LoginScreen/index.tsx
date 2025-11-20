import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { styles } from './styles';
import { Image } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const colors = useThemeColors();

  const [email, setEmail] = useState('admin@levelup.com');
  const [password, setPassword] = useState('admin123');

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showEmptyPopup, setShowEmptyPopup] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setShowEmptyPopup(true);
      return;
    }

    const ok = await login(email.trim(), password);

    if (!ok) {
      setShowErrorPopup(true);
      return;
    }

    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderWidth: 0, borderColor: 'transparent' }
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
          Admin: admin@levelup.com / Todas as senhas: admin123
        </Text>
      </View>

      {showEmptyPopup && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 24,
              borderRadius: 12,
              width: '80%',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: colors.danger, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Campos obrigatórios
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              Preencha e-mail e senha antes de entrar.
            </Text>

            <TouchableOpacity
              onPress={() => setShowEmptyPopup(false)}
              style={{
                backgroundColor: colors.danger,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showErrorPopup && (
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <View
            style={{
              backgroundColor: colors.card,
              padding: 24,
              borderRadius: 12,
              width: '80%',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: colors.danger, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Login inválido
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              E-mail ou senha incorretos.
            </Text>

            <TouchableOpacity
              onPress={() => setShowErrorPopup(false)}
              style={{
                backgroundColor: colors.danger,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
