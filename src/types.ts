export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0 to 3
  explanation?: string;
  image?: string; // Optional image URL or base64 data for diagrams
}

export interface Period {
  id: string;
  name: string; // e.g. "الفترة الأولى", "الفترة الثانية"
  questions: Question[];
}

export interface Year {
  id: string;
  name: string; // e.g. "2025", "2024"
  periods: Period[];
}

export interface Subject {
  id: string;
  name: string; // e.g. "قانون العقوبات"
  years: Year[];
}

export interface Level {
  id: string;
  name: string; // e.g. "المستوى الثاني"
  subjects: Subject[];
}

export interface College {
  id: string;
  name: string; // e.g. "كلية الشريعة والقانون"
  levels: Level[];
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: { [questionId: string]: number }; // map question.id to selected index
  timeLeft: number; // in seconds
  isStarted: boolean;
  isFinished: boolean;
  shuffledQuestions: Question[];
  originalToShuffledMap: number[]; // maps original index to shuffled index
  shuffledOptionsMap: { [questionId: string]: number[] }; // maps question.id to option order
}

export interface ExamAttempt {
  id: string;
  collegeId: string;
  collegeName: string;
  subjectId: string;
  subjectName: string;
  yearId: string;
  yearName: string;
  periodId: string;
  periodName: string;
  timestamp: string; // ISO string
  score: number; // correct count
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  answers: { [questionId: string]: number };
}
