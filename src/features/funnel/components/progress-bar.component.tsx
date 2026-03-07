'use client'

import { motion } from 'framer-motion'

type Props = {
  progress: number
}

export function ProgressBar({ progress }: Props) {
  return (
    <div className="w-full h-1 bg-black/10">
      <motion.div
        className="h-full bg-violet-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}
