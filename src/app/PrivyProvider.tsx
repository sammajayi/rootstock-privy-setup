'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';
import { rsktestnet } from '@/lib/chains';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID

  if (!appId) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not set in environment variables');
  }

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        supportedChains: [rsktestnet],
        defaultChain: rsktestnet,
        
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false, 
        },

        appearance: {
          theme: 'light',
          accentColor: '#FF6600', 
          logo: '/rootstock.png',
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}



