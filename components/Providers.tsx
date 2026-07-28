'use client';

import { useEffect, type ReactNode } from 'react';
import { BlueHourAudioProvider } from './blue-hour/AudioExperience';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return <BlueHourAudioProvider>{children}</BlueHourAudioProvider>;
}
