// ============================================================
// DigitalWise — Type Definitions
// ============================================================

// ==================== QUIZ TYPES ====================

export type QuizCategory = 
  | 'phishing' 
  | 'password' 
  | 'privacy' 
  | 'malware' 
  | 'social';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export type QuizMode = 'dynamic' | 'fixed';

export type QuizStatus = 'draft' | 'published' | 'archived';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  image?: string;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  questionImage?: string;
  explanation: string;
  options: Option[];
  difficulty: QuizDifficulty;
  xpReward: number;
  correctCount: number;
  totalAttempts: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  mode: QuizMode;
  shuffleOptions: boolean;
  timePerQuestion: number;
  passingScore: number;
  xpReward: number;
  badgeId?: string;
  difficulty: QuizDifficulty;
  questionIds: string[];
  tags: string[];
  totalAttempts: number;
  averageScore: number;
  status: QuizStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== QUIZ SESSION TYPES ====================

export interface Answer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizSession {
  id: string;
  studentId: string;
  quizId: string;
  mode: QuizMode;
  shuffledQuestionIds: string[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  passed: boolean;
  xpEarned: number;
  badgeEarned?: string;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
}

// ==================== USER TYPES ====================

export type UserRole = 'student' | 'admin' | 'teacher';

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  soundEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  completedMissions: string[];
  settings: UserSettings;
  createdAt: Date;
  lastLoginAt: Date;
}

// ==================== ADMIN TYPES ====================

export type AdminRole = 'developer' | 'admin' | 'teacher';

export interface AdminPermissions {
  canCreateQuiz: boolean;
  canEditAnyQuiz: boolean;
  canDeleteQuiz: boolean;
  canPublish: boolean;
  canManageAdmins: boolean;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermissions;
  assignedCategories?: QuizCategory[];
}

// ==================== MISSION TYPES ====================

export type MissionType = 'daily' | 'weekly' | 'achievement';

export type MissionCategory = 'quiz' | 'material' | 'forum' | 'streak';

export interface MissionRequirement {
  type: string;
  target: number;
  current: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  category: MissionCategory;
  xpReward: number;
  badgeReward?: string;
  requirements: MissionRequirement[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

// ==================== MATERIAL TYPES ====================

export type MaterialCategory = 'phishing' | 'password' | 'privacy' | 'malware' | 'social';

export type MaterialDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface MaterialContent {
  sections: MaterialSection[];
}

export interface MaterialSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  category: MaterialCategory;
  difficulty: MaterialDifficulty;
  content: MaterialContent;
  estimatedMinutes: number;
  xpReward: number;
  thumbnail: string;
  order: number;
  isPublished: boolean;
  views: number;
  completions: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== FORUM TYPES ====================

export type ForumCategory = 'general' | 'help' | 'discussion' | 'report';

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  category: ForumCategory;
  tags: string[];
  likes: number;
  commentsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumComment {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likes: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== NOTIFICATION TYPES ====================

export type NotificationType = 'mission' | 'badge' | 'forum' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

// ==================== REPORT TYPES ====================

export type ReportType = 'phishing' | 'scam' | 'bullying' | 'other';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  type: ReportType;
  title: string;
  description: string;
  evidence: string[];
  status: ReportStatus;
  adminNotes?: string;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== RANKING TYPES ====================

export type RankingPeriod = 'weekly' | 'monthly' | 'alltime';

export interface Ranking {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: string[];
  rank: number;
  period: RankingPeriod;
  updatedAt: Date;
  createdAt: Date;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ==================== QUIZ ENGINE TYPES ====================

export interface QuizProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  xpEarned: number;
  badgeEarned?: string;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
}
