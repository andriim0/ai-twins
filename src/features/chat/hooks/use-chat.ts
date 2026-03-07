'use client'

import { useState, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useQuizStore } from '@/features/quiz/store'
import { useTrackEvent } from '@/features/events/hooks/use-track-event'
import { EVENT_TYPES } from '@/features/events/types'
import { fetchChatReply, fetchAnalysis } from '@/features/chat/api'
import type { ChatMessage, AnalysisResult } from '@/features/chat/types'
import { MAX_CHAT_MESSAGES_BEFORE_ANALYSIS } from '@/features/funnel/config/ai-twin.config'
import { ApiError } from '@/lib/errors'
import type { QuizData } from '@/features/quiz/types'

const GOAL_OPENERS: Record<string, string> = {
  'manage-stress': "What's been weighing on you lately — even if it seems small?",
  'relationships': "Is there a relationship in your life you'd like to talk about today?",
  'confidence': "What's one area where you wish you felt more confident?",
  'anxiety': "How has anxiety been showing up for you recently?",
}

function buildIntroMessage(quizData: QuizData): ChatMessage {
  const name = quizData.name ? `, ${quizData.name}` : ''
  const opener = GOAL_OPENERS[quizData.goal ?? ''] ?? 'How are you feeling today?'

  return {
    id: 'intro',
    role: 'assistant',
    content: `Hi${name}! I'm your AI twin — I'm here to listen without judgment, at your own pace. ${opener}`,
    createdAt: Date.now(),
  }
}

type UseChatResult = {
  messages: ChatMessage[]
  isTyping: boolean
  isAnalyzing: boolean
  analysisResult: AnalysisResult | null
  isAnalysisOpen: boolean
  sendMessage: (content: string) => Promise<void>
  closeAnalysis: () => void
  openAnalysis: () => void
}

export function useChat(): UseChatResult {
  const { quizData } = useQuizStore()
  const [messages, setMessages] = useState<ChatMessage[]>(() => [buildIntroMessage(quizData)])
  const [isTyping, setIsTyping] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)
  const userMessageCountRef = useRef(0)
  const lastMessageAtRef = useRef(Date.now())

  const { track } = useTrackEvent()

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    const trimmedContent = content.trim()
    if (!trimmedContent) return

    const timeSincePrevious = Date.now() - lastMessageAtRef.current
    lastMessageAtRef.current = Date.now()
    userMessageCountRef.current += 1
    const messageCount = userMessageCountRef.current

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: trimmedContent,
      createdAt: Date.now(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    track(EVENT_TYPES.MESSAGE_SENT, {
      messageCount,
      messageLength: trimmedContent.length,
      timeSincePrevious,
    })

    if (messageCount < MAX_CHAT_MESSAGES_BEFORE_ANALYSIS) {
      setIsTyping(true)
      try {
        const replyContent = await fetchChatReply(updatedMessages, quizData)
        const botMessage: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: replyContent,
          createdAt: Date.now(),
        }
        setMessages((prev) => [...prev, botMessage])
      } catch (err) {
        if (!(err instanceof ApiError)) {
          console.error('Unexpected error in fetchChatReply', err)
        }
      } finally {
        setIsTyping(false)
      }
      return
    }

    setIsAnalyzing(true)

    try {
      const userMessages = updatedMessages
        .filter((m) => m.role === 'user')
        .map((m) => m.content)

      const result = await fetchAnalysis(userMessages, quizData)

      setAnalysisResult(result)
      setIsAnalysisOpen(true)
      track(EVENT_TYPES.ANALYSIS_SHOWN, {
        stressors: result.stressors,
        emotionalTone: result.emotionalTone,
        intensity: result.intensity,
      })
    } catch (err) {
      const botMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm taking a moment to process everything you've shared. You've opened up beautifully.",
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, botMessage])

      if (!(err instanceof ApiError)) {
        console.error('Unexpected error in fetchAnalysis', err)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }, [messages, quizData, track])

  function closeAnalysis(): void {
    setIsAnalysisOpen(false)
    track(EVENT_TYPES.ANALYSIS_DISMISSED, {
      readDuration: Date.now() - lastMessageAtRef.current,
    })
  }

  function openAnalysis(): void {
    setIsAnalysisOpen(true)
  }

  return { messages, isTyping, isAnalyzing, analysisResult, isAnalysisOpen, sendMessage, closeAnalysis, openAnalysis }
}
