'use client'

import { useLogin, usePrivy } from '@privy-io/react-auth'


export function LoginButton() {
  const { login, logout } = usePrivy()

  const { ready, authenticated } = usePrivy()



  if (authenticated) {
    return (
      <button
        onClick={logout}
        className="bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg font-semibold cursor-pointer mt-5 border-none outline-0"
      >
        Logout
      </button>
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