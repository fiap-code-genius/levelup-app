import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { Task } from '../../services/storage';
import { styles } from './styles';

const AnyPicker: any = Picker;

export default function AdminTasksScreen() {
  const { users, tasks, createTask, deleteTask } = useAuth();
  const colors = useThemeColors();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(undefined);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const normalUsers = users.filter(u => u.role === 'USER');

  const handleCreate = async () => {
    if (!title || !points || !assignedUserId) {
      setShowErrorPopup(true);
      return;
    }

    const pointsNumber = Number(points);
    if (isNaN(pointsNumber) || pointsNumber <= 0) {
      setShowErrorPopup(true);
      return;
    }

    await createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      points: pointsNumber,
      assignedToUserId: assignedUserId,
    });

    setTitle('');
    setDescription('');
    setPoints('');
    setAssignedUserId(undefined);

    Keyboard.dismiss();
    setShowSuccessPopup(true);
  };

  const renderItem = ({ item }: { item: Task }) => {
    const user = users.find(u => u.id === item.assignedToUserId);
    return (
      <View style={[styles.taskRow, { borderColor: colors.border }]}>
        <View style={styles.taskInfo}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
          {item.description ? (
            <Text style={[styles.taskDesc, { color: colors.textSecondary }]}>
              {item.description}
            </Text>
          ) : null}
          <Text style={[styles.taskMeta, { color: colors.textSecondary }]}>
            {item.points} pts • {user ? user.fullName : 'Usuário removido'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.danger }]}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={[styles.deleteText, { color: colors.danger }]}>Excluir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: 70 }]}>
      <Text style={[styles.title, { color: colors.text }]}>Tarefas</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Cadastrar tarefa
        </Text>

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Título"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Descrição (opcional)"
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Pontos"
          placeholderTextColor={colors.textSecondary}
          value={points}
          onChangeText={setPoints}
          keyboardType="numeric"
        />

        <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
          <AnyPicker
            selectedValue={assignedUserId ?? ''}
            onValueChange={(value: string) =>
              setAssignedUserId(value === '' ? undefined : value)
            }
            dropdownIconColor={colors.text}
            style={{ color: colors.text }}
          >
            <AnyPicker.Item label="Selecione um usuário" value="" color={colors.text} />
            {normalUsers.map(user => (
              <AnyPicker.Item
                key={user.id}
                label={user.fullName}
                value={user.id}
                color={colors.text}
              />
            ))}
          </AnyPicker>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
        >
          <Text style={styles.buttonText}>Salvar tarefa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
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
              Tarefa cadastrada!
            </Text>

            <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 20 }}>
              A nova tarefa foi registrada com sucesso.
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
              Preencha título, pontos e selecione um usuário.
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
