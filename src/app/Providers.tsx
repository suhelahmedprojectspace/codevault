'use client';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { store } from '@/lib/store/store';
import PresenceSetter from '@/components/PresenceSetter';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <PresenceSetter />
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
