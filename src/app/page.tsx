import Image from 'next/image';
import LoginButton from './components/LoginButton'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-white/90 shadow-xl rounded-2xl p-5 flex flex-col items-center max-w-xl w-full">
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
    </div>
  );
}
