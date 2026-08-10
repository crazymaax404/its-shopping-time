import React, { ReactNode } from 'react';
import { useRealtimeSync } from '@/services/sync/realtime';

export function RealtimeProvider({ children }: { children: ReactNode }) {
  useRealtimeSync();
  return <>{children}</>;
}