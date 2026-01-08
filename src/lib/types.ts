
export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface Project {
  id: string;
  name:string;
  description: string;
  ownerId: string;
  memberIds: string[];
  startDate: string;
  endDate?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  estimatedGains?: number;
}

export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: any;
  tags?: string[];
  projectId: string;
  subtasks?: Subtask[];
  attachments?: Attachment[];
  comments?: Comment[];
  createdAt: any;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: any;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: any;
  link?: string;
}
