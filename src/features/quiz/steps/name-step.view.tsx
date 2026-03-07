"use client";

import { useState, useEffect, useRef } from "react";
import { useTrackOnMount } from "@/features/events/hooks/use-track-on-mount";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/features/quiz/store";
import { useFunnelNavigation } from "@/features/funnel/hooks/use-funnel-navigation";
import { useTrackEvent } from "@/features/events/hooks/use-track-event";
import { EVENT_TYPES } from "@/features/events/types";

type Props = { funnelSlug: string };

export function NameStepView({ funnelSlug }: Props) {
  const { quizData, setName, startQuiz } = useQuizStore();
  const { goToNext } = useFunnelNavigation(funnelSlug, "name");
  const { track } = useTrackEvent();
  const [value, setValue] = useState(quizData.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useTrackOnMount(EVENT_TYPES.QUIZ_START);

  useEffect(() => {
    startQuiz();
    inputRef.current?.focus();
  }, []);

  const isValid = value.trim().length >= 2;

  function handleContinue(): void {
    if (!isValid) return;
    setName(value.trim());
    goToNext();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      className="w-full max-w-lg flex flex-col gap-8 text-center"
    >
      <div className="flex flex-col gap-3">
        <p className="text-violet-500 text-sm font-medium tracking-widest uppercase">
          Step 1 of 5
        </p>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          What should your AI twin call you?
        </h1>
        <p className="text-gray-500 text-lg">
          Your twin will personalize every response just for you.
        </p>
      </div>

      <Input
        type="text"
        placeholder="Your first name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        ref={inputRef}
        className="text-center text-3xl h-14 bg-black/5 border-black/20 text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:ring-violet-400/30"
        maxLength={50}
      />

      <Button
        onClick={handleContinue}
        disabled={!isValid}
        className="h-14 text-xl font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 disabled:opacity-30 transition-all"
      >
        Continue
      </Button>
    </motion.div>
  );
}
