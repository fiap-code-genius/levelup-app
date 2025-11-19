import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  pointBalance: number;
  totalPoints: number;
  level: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  assignedToUserId: string;
  completed: boolean;
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
  cost: number;
}

const USERS_KEY = '@levelup:users';
const TASKS_KEY = '@levelup:tasks';
const REWARDS_KEY = '@levelup:rewards';

function generateId(prefix: string = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function calculateLevel(points: number) {
  if (points >= 6000) return 5;
  if (points >= 3200) return 4;
  if (points >= 1800) return 3;
  if (points >= 900) return 2;
  return 1;
}

async function getArray<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function setArray<T>(key: string, data: T[]) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getUsers() {
  return getArray<User>(USERS_KEY);
}

export async function getTasks() {
  return getArray<Task>(TASKS_KEY);
}

export async function getRewards() {
  return getArray<Reward>(REWARDS_KEY);
}

export async function saveUsers(users: User[]) {
  await setArray(USERS_KEY, users);
}

export async function saveTasks(tasks: Task[]) {
  await setArray(TASKS_KEY, tasks);
}

export async function saveRewards(rewards: Reward[]) {
  await setArray(REWARDS_KEY, rewards);
}

export async function seedInitialData() {
  const existingUsers = await getArray<User>(USERS_KEY);
  if (existingUsers.length > 0) return;

  const now = new Date().toISOString();

  const users: User[] = [
    {
      id: generateId('u_'),
      fullName: 'Admin LevelUp',
      email: 'admin@levelup.com',
      role: 'ADMIN',
      pointBalance: 0,
      totalPoints: 0,
      level: 1,
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Ana Souza',
      email: 'ana.souza@amazon.com',
      role: 'USER',
      pointBalance: 780,
      totalPoints: 1200,
      level: calculateLevel(1200),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Bruno Lima',
      email: 'bruno.lima@amazon.com',
      role: 'USER',
      pointBalance: 450,
      totalPoints: 2200,
      level: calculateLevel(2200),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Carla Mendes',
      email: 'carla.mendes@amazon.com',
      role: 'USER',
      pointBalance: 900,
      totalPoints: 3400,
      level: calculateLevel(3400),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Diego Santos',
      email: 'diego.santos@amazon.com',
      role: 'USER',
      pointBalance: 1500,
      totalPoints: 6500,
      level: calculateLevel(6500),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Eduarda Costa',
      email: 'eduarda.costa@amazon.com',
      role: 'USER',
      pointBalance: 700,
      totalPoints: 800,
      level: calculateLevel(800),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Fernando Silva',
      email: 'fernando.silva@amazon.com',
      role: 'USER',
      pointBalance: 1300,
      totalPoints: 1900,
      level: calculateLevel(1900),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Gabriela Rocha',
      email: 'gabriela.rocha@amazon.com',
      role: 'USER',
      pointBalance: 600,
      totalPoints: 3100,
      level: calculateLevel(3100),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Henrique Alves',
      email: 'henrique.alves@amazon.com',
      role: 'USER',
      pointBalance: 400,
      totalPoints: 3600,
      level: calculateLevel(3600),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'Isabela Freitas',
      email: 'isabela.freitas@amazon.com',
      role: 'USER',
      pointBalance: 2000,
      totalPoints: 6200,
      level: calculateLevel(6200),
      createdAt: now,
    },
    {
      id: generateId('u_'),
      fullName: 'João Pereira',
      email: 'joao.pereira@amazon.com',
      role: 'USER',
      pointBalance: 100,
      totalPoints: 950,
      level: calculateLevel(950),
      createdAt: now,
    },
  ];

  const findUserId = (email: string) =>
    users.find(u => u.email === email)?.id || users[0].id;

  const tasks: Task[] = [
    {
      id: generateId('t_'),
      title: 'Happy Hour Online da Equipe',
      description:
        'Participar de happy hour online com a equipe para fortalecer vínculos em ambiente 100% remoto.',
      points: 50,
      assignedToUserId: findUserId('ana.souza@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Sessão de Feedback 1:1',
      description:
        'Conduzir uma conversa de feedback construtivo com um colega via videoconferência.',
      points: 70,
      assignedToUserId: findUserId('bruno.lima@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Workshop de Escuta Ativa',
      description:
        'Participar de workshop remoto sobre escuta ativa em times distribuídos.',
      points: 60,
      assignedToUserId: findUserId('carla.mendes@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Ritual de Check-in Emocional',
      description:
        'Abrir a daily remota com um check-in emocional de 5 minutos com a equipe.',
      points: 40,
      assignedToUserId: findUserId('diego.santos@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Coffee Chat Inter-Equipes',
      description:
        'Agendar um coffee chat virtual com alguém de outra equipe (IA, RH, Marketing, CX).',
      points: 50,
      assignedToUserId: findUserId('eduarda.costa@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Treinamento de Comunicação Não Violenta',
      description:
        'Realizar módulo online sobre CNV aplicada a conflitos em times remotos.',
      points: 80,
      assignedToUserId: findUserId('fernando.silva@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Dinâmica de Team Building Online',
      description:
        'Participar de dinâmica de team building facilitada totalmente online.',
      points: 70,
      assignedToUserId: findUserId('gabriela.rocha@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Projeto X',
      description: 'Concluir projeto X, sprint 4.',
      points: 40,
      assignedToUserId: findUserId('henrique.alves@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Gartic da Firma',
      description: 'Jogar Gartic com a equipe.',
      points: 30,
      assignedToUserId: findUserId('isabela.freitas@amazon.com'),
      completed: false,
    },
    {
      id: generateId('t_'),
      title: 'Apresentação Mensal',
      description:
        'Atuar como mentor e apresentar uma ideia ou projeto que você realizou, os desafios e pontos altos dessa conquista.',
      points: 90,
      assignedToUserId: findUserId('joao.pereira@amazon.com'),
      completed: false,
    },
  ];

  const rewards: Reward[] = [
    {
      id: generateId('r_'),
      title: 'Gift Card Amazon',
      description: 'R$100',
      cost: 800,
    },
    {
      id: generateId('r_'),
      title: 'Gift Card Outback',
      description: 'R$150',
      cost: 800,
    },
    {
      id: generateId('r_'),
      title: 'SPA',
      description: 'Uma sessão de Spa no BuddhaSpa',
      cost: 950,
    },
    {
      id: generateId('r_'),
      title: 'Day-off de Bem-Estar Digital',
      description:
        'Dia de folga focado em desconexão e recuperação em ambiente remoto.',
      cost: 1200,
    },
    {
      id: generateId('r_'),
      title: 'Upgrade de Equipamento Ergonômico',
      description:
        'Ajuda de custo para cadeira ou apoio ergonômico para home office (R$800).',
      cost: 3200,
    },
    {
      id: generateId('r_'),
      title: 'Kit Home Office Confortável',
      description:
        'Kit com itens para melhorar o conforto do trabalho remoto (cadeira, apoio de pés e mouse ergonômico).',
      cost: 6000,
    },
    {
      id: generateId('r_'),
      title: 'Gift Card Steam',
      description: 'R$50',
      cost: 350,
    },
    {
      id: generateId('r_'),
      title: 'Gift Card iFood',
      description: 'R$100',
      cost: 600,
    },
    {
      id: generateId('r_'),
      title: 'Créditos na Alura',
      description: '2 meses para usar como quiser.',
      cost: 100,
    },
    {
      id: generateId('r_'),
      title: 'Workshop',
      description: 'Sessão online com especialista na área do mês.',
      cost: 200,
    },
  ];

  await saveUsers(users);
  await saveTasks(tasks);
  await saveRewards(rewards);
}
