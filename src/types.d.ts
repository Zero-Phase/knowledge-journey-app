
// src/types.d.ts
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  avatarUrl?: string;
  timezone?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    deadlines: boolean;
    activities: boolean;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  color: string;
  userId: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  courseId?: string;
  courseName?: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  userId: string;
  priority: 'low' | 'medium' | 'high';
}
