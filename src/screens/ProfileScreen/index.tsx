import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme, useThemeColors } from '../../context/ThemeContext';
import { styles } from './styles';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const colors = useThemeColors();

  if (!currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Nenhum usuário logado
        </Text>
      </View>
    );
  }

  const createdAtLabel = new Date(currentUser.createdAt).toLocaleDateString(
    'pt-BR'
  );
  const roleLabel =
    currentUser.role === 'ADMIN' ? 'Administrador' : 'Colaborador';

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 85 }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Perfil
      </Text>

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
        <Text style={[styles.name, { color: colors.text }]}>
          {currentUser.fullName}
        </Text>

        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {currentUser.email}
        </Text>

        <Text style={[styles.info, { color: colors.text }]}>
          Tipo de conta: {roleLabel}
        </Text>

        <Text style={[styles.info, { color: colors.text }]}>
          Level: {currentUser.level}
        </Text>

        <Text style={[styles.info, { color: colors.text }]}>
          Pontos atuais: {currentUser.pointBalance}
        </Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
          onPress={toggleTheme}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            Modo {mode === 'light' ? 'escuro 🌙' : 'claro ☀️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.danger, borderColor: colors.danger },
          ]}
          onPress={logout}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
