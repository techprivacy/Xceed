'use client';

import { useEffect, useState } from 'react';

export type FeedbackType = 'success' | 'error';

export interface FeedbackMessage {
  type: FeedbackType;
  text: string;
}

export function useTimedFeedback(durationMs = 2500) {
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), durationMs);
    return () => clearTimeout(timer);
  }, [feedback, durationMs]);

  const showFeedback = (type: FeedbackType, text: string) => setFeedback({ type, text });
  const clearFeedback = () => setFeedback(null);

  return { feedback, showFeedback, clearFeedback };
}
