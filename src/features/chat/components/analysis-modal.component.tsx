"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/features/chat/types";
import { INTENSITY_COLORS } from "@/features/chat/types";
import { useQuizStore } from "@/features/quiz/store";

type Props = {
  isOpen: boolean;
  result: AnalysisResult | null;
  onClose: () => void;
  onContinue: () => void;
};

export function AnalysisModal({ isOpen, result, onClose, onContinue }: Props) {
  const { quizData } = useQuizStore();

  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white border-black/10 text-gray-900 max-w-md">
        <DialogHeader>
          <div className="text-3xl mb-1">🔍</div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {quizData.name ? `${quizData.name}'s` : "Your"} Stress Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Intensity:</span>
            <span
              className={`font-semibold capitalize text-sm ${INTENSITY_COLORS[result.intensity]}`}
            >
              {result.intensity}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Emotional Tone
            </p>
            <p className="text-gray-800">{result.emotionalTone}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Key Stressors
            </p>
            <div className="flex flex-wrap gap-2">
              {result.stressors.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="text-sm bg-rose-500/20 text-rose-300 border-rose-500/30"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-gray-400 text-xs uppercase tracking-wider">
              Key Themes
            </p>
            <div className="flex flex-wrap gap-2">
              {result.keyThemes.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="text-sm bg-violet-500/20 text-violet-300 border-violet-500/30"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-black/5 border border-black/10 rounded-xl p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
              Recommendation
            </p>
            <p className="text-gray-800 text-sm leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          <Button
            onClick={onContinue}
            className="h-12 font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 transition-all"
          >
            Unlock my full plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
