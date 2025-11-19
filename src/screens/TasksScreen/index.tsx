import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Modal } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useThemeColors } from '../../context/ThemeContext';
import { Task } from '../../services/storage';
import { styles } from './styles';

const TasksScreen: React.FC = () => {
  const { tasks, currentUser, completeTask } = useAuth();
  const colors = useThemeColors();

  const [showPopup, setShowPopup] = useState(false);
  const [floatingXP, setFloatingXP] = useState<string | null>(null);
  const [floatingPosition, setFloatingPosition] = useState<{ x: number; y: number } | null>(null);
  const xpAnim = useRef(new Animated.Value(0)).current;

  if (!currentUser) return null;

  const userTasks = tasks.filter(t => t.assignedToUserId === currentUser.id);

  const TaskItem = ({ item }: { item: Task }) => {
    const buttonShake = useRef(new Animated.Value(0)).current;

    const shakeButton = () => {
      Animated.sequence([
        Animated.timing(buttonShake, { toValue: 8, duration: 50, useNativeDriver: true }),
        Animated.timing(buttonShake, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(buttonShake, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(buttonShake, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(buttonShake, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    };

    const triggerFloatingXP = (points: number, pageX: number, pageY: number) => {
      setFloatingXP(`+${points} XP`);
      setFloatingPosition({ x: pageX - 40, y: pageY - 20 });

      xpAnim.setValue(0);

      Animated.timing(xpAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true
      }).start(() => setFloatingXP(null));
    };

    const handleComplete = (id: string, points: number, event: any) => {
      shakeButton();

      const { pageX, pageY } = event.nativeEvent;
      triggerFloatingXP(points, pageX, pageY);

      setTimeout(() => setShowPopup(true), 1900);
      setTimeout(() => completeTask(id), 900);
    };

    return (
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
        <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>

        {item.description ? (
          <Text style={[styles.taskDesc, { color: colors.textMuted ?? colors.textSecondary }]}>
            {item.description}
          </Text>
        ) : null}

        <Text style={[styles.taskPoints, { color: colors.primary }]}>
          +{item.points} pontos
        </Text>

        <Animated.View style={{ transform: [{ translateX: buttonShake }] }}>
          <TouchableOpacity
            onPress={(e) => handleComplete(item.id, item.points, e)}
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
        </Animated.View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: 70 }
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Suas tarefas</Text>

      <FlatList
        data={userTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem item={item} />}
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

      {floatingXP && floatingPosition && (
        <Animated.Text
          style={{
            position: 'absolute',
            left: floatingPosition.x,
            top: floatingPosition.y,
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.primary,
            opacity: xpAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            }),
            transform: [
              {
                translateY: xpAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60]
                })
              }
            ]
          }}
        >
          {floatingXP}
        </Animated.Text>
      )}

      <Modal transparent visible={showPopup} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
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
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10
              }}
            >
              Tarefa concluída!
            </Text>

            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 15,
                textAlign: 'center',
                marginBottom: 20
              }}
            >
              Seus pontos foram adicionados ao saldo.
            </Text>

            <TouchableOpacity
              onPress={() => setShowPopup(false)}
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
      </Modal>
    </View>
  );
};

export default TasksScreen;
