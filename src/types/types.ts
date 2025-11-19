export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  level: number;
  totalPoints: number;
  currentPoints: number;
  completedTaskIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  points: number;
  assignedToUserId: string;
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
  cost: number;
}

export interface AuthState {
  currentUser?: User;
  users: User[];
  tasks: Task[];
  rewards: Reward[];
}
