import {usePrivy} from '@privy-io/react-auth';
import { Copy} from 'lucide-react'

function ExportWalletButton() {
  const {ready, authenticated, user, exportWallet} = usePrivy();
  
  const isAuthenticated = ready && authenticated;
  
  const hasEmbeddedWallet = !!user.linkedAccounts.find(
    (account) =>
      account.type === 'wallet' &&
      account.walletClientType === 'privy' &&
      account.chainType === 'ethereum'
  );

  return (
    <button onClick={exportWallet} disabled={!isAuthenticated || !hasEmbeddedWallet}
    className='flex text-black px-6 hover:bg-blue-100  text-sm py-5 rounded-lg font-semibold cursor-pointer mt-5 border-none outline-0'
    >
    Export Wallet
      <Copy className='ml-2 h-5 w-5' />
    </button>
  );
}

export default ExportWalletButton;

