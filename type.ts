export interface Task {
    id: string;
    title: string;
    detail: string;
    status: 'pending' | 'in-progress' | 'completed';
    userId: string;
  }