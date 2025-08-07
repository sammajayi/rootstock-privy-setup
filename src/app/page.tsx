'use client';

import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import LoginButton from './components/LoginButton'
import MessageContract from './components/MessageContract'

export default function Home() {
  const { ready, authenticated } = usePrivy();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
      <div className="flex flex-col items-center max-w-4xl mx-auto px-4">
        
     
        {ready && !authenticated && (
          <div className="bg-white/90 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center max-w-xl w-full">
            <Image
              src="/rootstock.png"
              alt="rootstock logo"
              width={200}
              height={200}
            />
            <h1 className="font-extrabold mb-2 text-3xl text-gray-900 text-center">Rootstock Social Network</h1>
            <p className="text-gray-700 font-medium text-base mb-5 text-center">Connect and Learn about DeFi</p>
            <LoginButton />
            <p className="text-gray-600 mt-6 text-[10px] italic">No Web3 knowledge required</p>
          </div>
        )}

        {/* Show message contract when authenticated */}
        {ready && authenticated && (
          <div className="w-full max-w-4xl">
            <div className="bg-white/90 shadow-xl rounded-2xl p-6 mb-6 flex flex-col items-center">
              <Image
                src="/rootstock.png"
                alt="rootstock logo"
                width={120}
                height={120}
              />
              <h1 className="font-extrabold mb-2 text-2xl text-gray-900 text-center">Welcome to Rootstock Social Network</h1>
              <p className="text-gray-700 font-medium text-sm mb-4 text-center">You&apos;re connected to Rootstock Testnet</p>
              <LoginButton />
            </div>
            <MessageContract />
          </div>
        )}

        {!ready && (
          <div className="bg-white/90 shadow-xl rounded-2xl p-8 flex flex-col items-center justify-center max-w-xl w-full">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-dashed border-black rounded-full"></div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
