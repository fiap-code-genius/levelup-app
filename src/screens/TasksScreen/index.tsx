import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { Task } from '../../services/storage';
import { styles } from './styles';

const TasksScreen: React.FC = () => {
  const { tasks, currentUser, completeTask } = useAuth();
  const colors = useThemeColors();

  if (!currentUser) {
    return null;
  }

  const userTasks = tasks.filter(
    t => t.assignedToUserId === currentUser.id
  );

  const renderItem = ({ item }: { item: Task }) => (
    <View
      style={[
        styles.taskCard,
        {
          backgroundColor: colors.card,
          borderWidth: 0,
          borderColor: 'transparent'
        }
      ]}
    >
      <Text style={[styles.taskTitle, { color: colors.text }]}>
        {item.title}
      </Text>

      {item.description ? (
        <Text
          style={[
            styles.taskDesc,
            { color: colors.textMuted ?? colors.textSecondary }
          ]}
        >
          {item.description}
        </Text>
      ) : null}

      <Text style={[styles.taskPoints, { color: colors.primary }]}>
        +{item.points} pontos
      </Text>

      <TouchableOpacity
        onPress={() => completeTask(item.id)}
        disabled={item.completed}
        style={[
          styles.button,
          {
            backgroundColor: item.completed ? colors.border : colors.primary,
            opacity: item.completed ? 0.6 : 1
          }
        ]}
      >
        <Text style={styles.buttonText}>
          {item.completed ? 'Concluída' : 'Concluir'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: 70 }
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Suas tarefas
      </Text>

      <FlatList
        data={userTasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <Text
            style={{
              color: colors.textMuted ?? colors.textSecondary,
              marginTop: 40,
              textAlign: 'center'
            }}
          >
            Nenhuma tarefa no momento.
          </Text>
        }
      />
    </View>
  );
};

export default TasksScreen;
