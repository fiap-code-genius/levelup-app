import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  User,
  Task,
  Reward,
  seedInitialData,
  getUsers,
  getTasks,
  getRewards,
  saveUsers,
  saveTasks,
  saveRewards,
  calculateLevel,
} from '../services/storage';

interface AuthContextValue {
  currentUser: User | undefined;
  users: User[];
  tasks: Task[];
  rewards: Reward[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<void>;
  createUser: (data: { fullName: string; email: string; role?: 'ADMIN' | 'USER' }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  createTask: (data: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createReward: (data: Omit<Reward, 'id'>) => Promise<void>;
  deleteReward: (rewardId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

 async function loadAll() {
  const [u, t, r] = await Promise.all([getUsers(), getTasks(), getRewards()]);

  const normalizedUsers = u.map(user => {
    const safePointBalance = Number.isFinite(user.pointBalance)
      ? user.pointBalance
      : 0;

    const safeTotalPoints = Number.isFinite(user.totalPoints)
      ? user.totalPoints
      : safePointBalance;

    const safeLevel = calculateLevel(safeTotalPoints);

    return {
      ...user,
      pointBalance: safePointBalance,
      totalPoints: safeTotalPoints,
      level: safeLevel,
    };
  });

  setUsers(normalizedUsers);
  setTasks(t);
  setRewards(r);
  await saveUsers(normalizedUsers);
}

  useEffect(() => {
    (async () => {
      await seedInitialData();
      await loadAll();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password !== 'admin123') {
      return false;
    }
    setCurrentUser(user);
    return true;
  };

  const logout = async () => {
    setCurrentUser(undefined);
  };

  const completeTask = async (taskId: string) => {
    if (!currentUser) return;

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    if (task.completed) {
      Alert.alert('Ops', 'Você já concluiu essa tarefa.');
      return;
    }

    const updatedTask: Task = { ...task, completed: true };
    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;

    const gained = task.points;
    const newTotalPoints = currentUser.totalPoints + gained;
    const newPointBalance = currentUser.pointBalance + gained;
    const newLevel = calculateLevel(newTotalPoints);

    const updatedUser: User = {
      ...currentUser,
      totalPoints: newTotalPoints,
      pointBalance: newPointBalance,
      level: newLevel,
    };

    const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));

    setTasks(newTasks);
    setUsers(newUsers);
    setCurrentUser(updatedUser);

    await saveTasks(newTasks);
    await saveUsers(newUsers);

  };

  const redeemReward = async (rewardId: string) => {
    if (!currentUser) return;

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (currentUser.pointBalance < reward.cost) {
      Alert.alert('Saldo insuficiente', 'Você não tem pontos suficientes para este prêmio.');
      return;
    }

    const newPointBalance = currentUser.pointBalance - reward.cost;

    const updatedUser: User = {
      ...currentUser,
      pointBalance: newPointBalance,
    };

    const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));

    setUsers(newUsers);
    setCurrentUser(updatedUser);
    await saveUsers(newUsers);

  };

  const createUser = async (data: { fullName: string; email: string; role?: 'ADMIN' | 'USER' }) => {
    const exists = users.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      Alert.alert('Erro', 'Já existe um usuário com esse e-mail.');
      return;
    }

    const now = new Date().toISOString();
    const newUser: User = {
      id: `u_${Date.now()}`,
      fullName: data.fullName,
      email: data.email.trim(),
      role: data.role ?? 'USER',
      pointBalance: 0,
      totalPoints: 0,
      level: 1,
      createdAt: now,
    };

    const newUsers = [...users, newUser];
    setUsers(newUsers);
    await saveUsers(newUsers);
  };

  const deleteUser = async (userId: string) => {
    const newUsers = users.filter(u => u.id !== userId);
    const newTasks = tasks.filter(t => t.assignedToUserId !== userId);

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(undefined);
    }

    setUsers(newUsers);
    setTasks(newTasks);

    await saveUsers(newUsers);
    await saveTasks(newTasks);
  };

  const createTask = async (data: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: `t_${Date.now()}`,
      title: data.title,
      description: data.description,
      points: data.points,
      assignedToUserId: data.assignedToUserId,
      completed: false,
    };

    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  const deleteTask = async (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    await saveTasks(newTasks);
  };

  const createReward = async (data: Omit<Reward, 'id'>) => {
    const newReward: Reward = {
      id: `r_${Date.now()}`,
      title: data.title,
      description: data.description,
      cost: data.cost,
    };

    const newRewards = [...rewards, newReward];
    setRewards(newRewards);
    await saveRewards(newRewards);
  };

  const deleteReward = async (rewardId: string) => {
    const newRewards = rewards.filter(r => r.id !== rewardId);
    setRewards(newRewards);
    await saveRewards(newRewards);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        tasks,
        rewards,
        loading,
        login,
        logout,
        completeTask,
        redeemReward,
        createUser,
        deleteUser,
        createTask,
        deleteTask,
        createReward,
        deleteReward,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
