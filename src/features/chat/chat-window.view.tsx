'use client'

import { useState, useEffect, useRef } from 'react'
import { useTrackOnMount } from '@/features/events/hooks/use-track-on-mount'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuizStore } from '@/features/quiz/store'
import { useFunnelNavigation } from '@/features/funnel/hooks/use-funnel-navigation'
import { useTrackEvent } from '@/features/events/hooks/use-track-event'
import { useChat } from '@/features/chat/hooks/use-chat'
import { AnalysisModal } from '@/features/chat/components/analysis-modal.component'
import { EVENT_TYPES } from '@/features/events/types'
import { MAX_CHAT_MESSAGES_BEFORE_ANALYSIS } from '@/features/funnel/config/ai-twin.config'

type Props = { funnelSlug: string }

export function ChatWindowView({ funnelSlug }: Props) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { quizData } = useQuizStore()
  const { goToNext } = useFunnelNavigation(funnelSlug, 'chat')
  const { track } = useTrackEvent()
  const { messages, isTyping, isAnalyzing, analysisResult, isAnalysisOpen, sendMessage, closeAnalysis, openAnalysis } = useChat()
  useTrackOnMount(EVENT_TYPES.CHAT_OPENED)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(): Promise<void> {
    if (!inputValue.trim() || isTyping || isAnalyzing) return
    const content = inputValue
    setInputValue('')
    await sendMessage(content)
  }

  function handleAnalysisContinue(): void {
    closeAnalysis()
    track(EVENT_TYPES.PAYWALL_VIEW, { source: 'analysis_cta' })
    goToNext()
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const remaining = MAX_CHAT_MESSAGES_BEFORE_ANALYSIS - userMessageCount

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-lg flex flex-col h-[600px]"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-black/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <p className="text-gray-900 font-semibold">Your AI Twin</p>
          <p className="text-gray-400 text-xs">Online · Judgment-free zone</p>
        </div>
        {remaining > 0 && (
          <span className="ml-auto text-gray-400 text-xs">
            {remaining} message{remaining !== 1 ? 's' : ''} to your analysis
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${message.role === 'user'
                  ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-br-sm'
                  : 'bg-black/8 text-gray-800 rounded-bl-sm'
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {(isTyping || isAnalyzing) && (
          <div className="flex justify-start">
            <div className="bg-black/5 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 bg-black/30 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {analysisResult && !isAnalysisOpen && (
        <div className="flex items-center gap-2 py-2 px-3 mb-2 rounded-xl bg-violet-50 border border-violet-200">
          <span className="text-violet-700 text-sm flex-1">Your analysis is ready</span>
          <button onClick={openAnalysis} className="text-violet-600 text-sm font-medium hover:underline">
            View
          </button>
          <span className="text-violet-300">·</span>
          <button onClick={handleAnalysisContinue} className="text-violet-600 text-sm font-medium hover:underline">
            See plans
          </button>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-black/10">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Share your thoughts, ${quizData.name || 'friend'}...`}
          className="bg-black/5 border-black/20 text-gray-900 placeholder:text-gray-400 focus:border-violet-400"
          disabled={isTyping || isAnalyzing}
        />
        <Button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping || isAnalyzing}
          className="px-4 bg-violet-600 hover:bg-violet-500 text-white border-0 disabled:opacity-30"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      <AnalysisModal
        isOpen={isAnalysisOpen}
        result={analysisResult}
        onClose={closeAnalysis}
        onContinue={handleAnalysisContinue}
      />
    </motion.div>
  )
}
