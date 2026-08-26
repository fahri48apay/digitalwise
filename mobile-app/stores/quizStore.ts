import { create } from "zustand";

interface QuizQuestion {
  id: number;
  sender: string;
  senderMeta: string;
  body: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string[];
}

interface QuizState {
  quizId: string | null;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: { questionId: number; selectedIndex: number; isCorrect: boolean }[];
  isFinished: boolean;
  score: number;
  startQuiz: (quizId: string, questions: QuizQuestion[]) => void;
  answerQuestion: (questionId: number, selectedIndex: number) => boolean;
  nextQuestion: () => void;
  finishQuiz: () => { score: number; total: number; isPerfect: boolean };
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizId: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  isFinished: false,
  score: 0,

  startQuiz: (quizId, questions) =>
    set({ quizId, questions, currentIndex: 0, answers: [], isFinished: false, score: 0 }),

  answerQuestion: (questionId, selectedIndex) => {
    const { questions, currentIndex } = get();
    const q = questions[currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    set((state) => ({
      answers: [...state.answers, { questionId, selectedIndex, isCorrect }],
    }));
    return isCorrect;
  },

  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),

  finishQuiz: () => {
    const { answers, questions } = get();
    const score = answers.filter((a) => a.isCorrect).length;
    set({ isFinished: true, score });
    return { score, total: questions.length, isPerfect: score === questions.length };
  },

  resetQuiz: () =>
    set({ quizId: null, questions: [], currentIndex: 0, answers: [], isFinished: false, score: 0 }),
}));
