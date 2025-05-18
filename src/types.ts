
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
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
  name: string;
  description: string;
  deadline: string;
  subjects: Subject[];
  progress: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  progress: number;
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
  progress: number;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
  completed: boolean;
}

export interface Subtopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  courseId: string;
  courseName: string;
  startDate: string;
  endDate: string;
  durationInMinutes: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: string;
}
