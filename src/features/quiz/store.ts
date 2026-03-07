import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QuizData, Personality, TherapyStyle, PrimaryGoal, CurrentMood } from './types'

type QuizStore = {
  quizData: QuizData
  email: string
  quizStartedAt: number | null
  stepsRevisited: string[]
  setName: (name: string) => void
  setPersonality: (personality: Personality) => void
  setTherapyStyle: (therapyStyle: TherapyStyle) => void
  setGoal: (goal: PrimaryGoal) => void
  setMood: (mood: CurrentMood) => void
  setEmail: (email: string) => void
  markStepRevisited: (step: string) => void
  startQuiz: () => void
  reset: () => void
}

const INITIAL_QUIZ_DATA: QuizData = {
  name: '',
  personality: null,
  therapyStyle: null,
  goal: null,
  mood: null,
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set) => ({
      quizData: INITIAL_QUIZ_DATA,
      email: '',
      quizStartedAt: null,
      stepsRevisited: [],

      setName: (name) => set((state) => ({ quizData: { ...state.quizData, name } })),
      setPersonality: (personality) => set((state) => ({ quizData: { ...state.quizData, personality } })),
      setTherapyStyle: (therapyStyle) => set((state) => ({ quizData: { ...state.quizData, therapyStyle } })),
      setGoal: (goal) => set((state) => ({ quizData: { ...state.quizData, goal } })),
      setMood: (mood) => set((state) => ({ quizData: { ...state.quizData, mood } })),
      setEmail: (email) => set({ email }),
      markStepRevisited: (step) =>
        set((state) => ({
          stepsRevisited: state.stepsRevisited.includes(step)
            ? state.stepsRevisited
            : [...state.stepsRevisited, step],
        })),
      startQuiz: () => set({ quizStartedAt: Date.now() }),
      reset: () => set({ quizData: INITIAL_QUIZ_DATA, email: '', quizStartedAt: null, stepsRevisited: [] }),
    }),
    { name: 'dt-quiz-store' },
  ),
)
