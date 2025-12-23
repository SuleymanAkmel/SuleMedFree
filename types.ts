
export enum MedicalCategory {
  Intro = 'Intro to Medicine',
  Hematology = 'Hematology',
  CVS = 'Cardiovascular & Lymphatic',
  Respiratory = 'Respiratory System',
  GIS = 'Gastrointestinal System',
  MSK = 'Musculoskeletal & Integumentary',
  Renal = 'Kidney & Urinary System',
  Endocrine = 'Endocrine System',
  Reproductive = 'Reproductive System',
  Nervous = 'Nervous System',
  Infectious = 'Infectious Diseases'
}

export enum MedicalSubject {
  Anatomy = 'Anatomy',
  Physiology = 'Physiology',
  Biochemistry = 'Biochemistry',
  Microbiology = 'Microbiology',
  Pathology = 'Pathology',
  Pharmacology = 'Pharmacology'
}

export type StudyMode = 'Notes' | 'Flashcards' | 'Quiz';

export interface NoteSection {
  title: string;
  content: string;
  mnemonics: string[];
  clinicalCorrelate: string;
  imageDescription: string;
}

export interface Flashcard {
  front: string;
  back: string;
  explanation: string;
}

export interface Question {
  id: string;
  category: string;
  subject: MedicalSubject;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  mnemonic: string;
  videoLink: string;
  visualPrompt: string;
}

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  score: number;
  userAnswers: (number | null)[];
  isComplete: boolean;
}

export interface UserStats {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  streak: number;
  categoriesMastered: Record<string, number>;
  subjectProgress: Record<string, number>; // Count of MCQs done per subject
}
