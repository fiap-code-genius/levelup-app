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

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleCreate = async () => {
    if (!fullName || !email) {
      setShowErrorPopup(true);
      return;
    }

    await createUser({
      fullName: fullName.trim(),
      email: email.trim(),
      role,
    });

    setFullName('');
    setEmail('');
    setRole('USER');

    setShowSuccessPopup(true);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={[styles.row, { borderColor: colors.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: colors.text }]}>{item.fullName}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          {item.email}
        </Text>
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
          { backgroundColor: colors.card, borderWidth: 0, borderColor: 'transparent' }
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
              role === 'USER' && { backgroundColor: colors.primary }
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
              role === 'ADMIN' && { backgroundColor: colors.primary }
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

      {showSuccessPopup && (
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
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Usuário cadastrado!
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              O novo usuário foi registrado com sucesso.
            </Text>

            <TouchableOpacity
              onPress={() => setShowSuccessPopup(false)}
              style={{
                backgroundColor: colors.primary,
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
              Campos obrigatórios
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              Preencha nome completo e e-mail antes de salvar.
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

    </View>
  );
}
