import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { User } from '../../services/storage';
import { styles } from './styles';

export default function AdminUsersScreen() {
  const { users, createUser, deleteUser } = useAuth();
  const colors = useThemeColors();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const handleCreate = async () => {
    if (!fullName || !email) return;

    await createUser({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
    });

    setFullName('');
    setEmail('');
    setRole('USER');
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{item.email}</Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>
          {item.role} • Level {item.level}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: colors.danger }]}
        onPress={() => deleteUser(item.id)}
      >
        <Text style={[styles.deleteText, { color: colors.danger }]}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 70 }]}>
      <Text style={[styles.title, { color: colors.text }]}>Usuários</Text>

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
        <Text style={[styles.section, { color: colors.text }]}>Cadastrar usuário</Text>

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Nome completo"
          placeholderTextColor={colors.textSecondary}
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="E-mail"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'USER' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setRole('USER')}
          >
            <Text
              style={[
                styles.roleText,
                { color: role === 'USER' ? '#FFF' : colors.textSecondary }
              ]}
            >
              USER
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'ADMIN' && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setRole('ADMIN')}
          >
            <Text
              style={[
                styles.roleText,
                { color: role === 'ADMIN' ? '#FFF' : colors.textSecondary }
              ]}
            >
              ADMIN
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
