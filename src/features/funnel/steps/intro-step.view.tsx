"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFunnelNavigation } from "@/features/funnel/hooks/use-funnel-navigation";

type Props = { funnelSlug: string };

export function IntroStepView({ funnelSlug }: Props) {
  const { goToNext } = useFunnelNavigation(funnelSlug, "intro");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm flex flex-col items-center gap-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-amber-500 flex items-center justify-center text-4xl shadow-lg">
        🤖
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Your personal AI twin
        </h1>
        <p className="text-gray-500 max-w-xs text-lg">
          A judgment-free companion built around you — in 2 minutes.
        </p>
      </div>

      <Button
        onClick={goToNext}
        className="w-full h-14 text-xl font-semibold rounded-full bg-violet-600 hover:bg-violet-700 text-white border-0 disabled:opacity-30 transition-all"
      >
        Get started
      </Button>
    </motion.div>
  );
}
