'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ToastEventDetail } from '@/lib/toast';

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastEventDetail[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastEventDetail>).detail;
      setToasts((prev) => [...prev, detail]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== detail.id));
      }, 3500);
    };
    window.addEventListener('xceed-toast', handler);
    return () => window.removeEventListener('xceed-toast', handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex animate-fadeIn items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
            t.type === 'success'
              ? 'bg-white text-gray-800 ring-green-200'
              : 'bg-white text-gray-800 ring-red-200'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle2 size={16} className="shrink-0 text-green-600" />
          ) : (
            <XCircle size={16} className="shrink-0 text-red-600" />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
