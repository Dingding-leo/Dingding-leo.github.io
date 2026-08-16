'use client';

import { useEffect, type ReactNode } from 'react';
import { BlueHourAudioProvider } from './blue-hour/AudioExperience';

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? 'local';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const hadController = Boolean(navigator.serviceWorker.controller);
    const reloadKey = `blue-hour-sw-reloaded:${BUILD_ID}`;
    const onControllerChange = () => {
      if (!hadController) return;
      try {
        if (window.sessionStorage.getItem(reloadKey) === '1') return;
        window.sessionStorage.setItem(reloadKey, '1');
      } catch {
        // Reloading once is still safe when session storage is unavailable.
      }
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    void navigator.serviceWorker
      .register(`/sw.js?v=${encodeURIComponent(BUILD_ID)}`, {
        updateViaCache: 'none',
      })
      .then((registration) => registration.update())
      .catch((error: unknown) => {
        console.warn('[Austin Liu site] Service worker registration failed:', error);
      });

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      );
    };
  }, []);

  return <BlueHourAudioProvider>{children}</BlueHourAudioProvider>;
}
