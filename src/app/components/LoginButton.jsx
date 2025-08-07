'use client'

import { useLogin, usePrivy } from '@privy-io/react-auth'
import ExportWalletButton from './ExportWalletButton'
import { LogOut } from 'lucide-react'


export function LoginButton() {
  const { login, logout } = usePrivy()

  const { ready, authenticated } = usePrivy()



  if (authenticated) {
    return (
      <div className='flex  gap-4 items-center justify-center'>
         <ExportWalletButton />
     <button
        onClick={logout}
        className="flex bg-red-400 text-white hover:bg-red-600 text-sm px-6 py-3 rounded-lg font-bold cursor-pointer mt-5 border-none outline-0"
      >
        Logout
        <LogOut className='ml-2' />
      </button>

     
      </div>
 
    );
  }

  return (
    <button
      onClick={login}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer mt-5 border-none outline-0"
    >
      Sign In
    </button>
  )
}

export default LoginButton