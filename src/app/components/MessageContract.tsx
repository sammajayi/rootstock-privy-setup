'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { createPublicClient, createWalletClient, custom, formatEther, getAddress } from 'viem';
import { rsktestnet } from '@/lib/chains';


const MESSAGE_CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_msg",
				"type": "string"
			}
		],
		"name": "setMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]




const CONTRACT_ADDRESS = "0x6cdc46d643C144359486b0dC033F6E57671468b0" // testnet address

export default function MessageContract() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>('');

 
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  
  useEffect(() => {
    const getBalance = async () => {
      if (!embeddedWallet) return;
      
      try {
        await embeddedWallet.switchChain(31);
        const provider = await embeddedWallet.getEthereumProvider();
        
       
        const publicClient = createPublicClient({
          chain: rsktestnet,
          transport: custom(provider)
        });
        
        const balanceWei = await publicClient.getBalance({ 
          address: getAddress(embeddedWallet.address)
        });
        const balanceEth = formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(6));
      } catch (error) {
        console.error('Error checking balance:', error);
      }
    };

    getBalance();
  }, [embeddedWallet]);

  const readMessage = async () => {
    if (!embeddedWallet) return;
    
    try {
      setLoading(true);
      
      // rootstock testnet
      await embeddedWallet.switchChain(31);
      
      // to get provider
      const provider = await embeddedWallet.getEthereumProvider();
      
  
      const publicClient = createPublicClient({
        chain: rsktestnet,
        transport: custom(provider)
      });
      
      
      const result = await publicClient.readContract({
        address: getAddress(CONTRACT_ADDRESS),
        abi: MESSAGE_CONTRACT_ABI,
        functionName: 'getMessage',
      });
      
      setMessage(result as string);
    } catch (error) {
      console.error('Error reading message:', error);
      alert('Error reading message. Make sure the contract is deployed.');
    } finally {
      setLoading(false);
    }
  };

  const writeMessage = async () => {
    if (!embeddedWallet || !newMessage.trim()) return;
    
    try {
      setLoading(true);
      
      await embeddedWallet.switchChain(31);
      const provider = await embeddedWallet.getEthereumProvider();
      
      
      const publicClient = createPublicClient({
        chain: rsktestnet,
        transport: custom(provider)
      });
      
     
      const walletClient = createWalletClient({
        chain: rsktestnet,
        transport: custom(provider)
      });
      
      
      const [account] = await walletClient.getAddresses();
      
      // this will get current gas price for legacy transaction
      const gasPrice = await publicClient.getGasPrice();
      
     
      const gasEstimate = await publicClient.estimateContractGas({
        address: getAddress(CONTRACT_ADDRESS),
        abi: MESSAGE_CONTRACT_ABI,
        functionName: 'setMessage',
        args: [newMessage],
        account,
      });

      // enforcing type 0 transaction for Rootstock compatibility
      const hash = await walletClient.writeContract({
        address: getAddress(CONTRACT_ADDRESS),
        abi: MESSAGE_CONTRACT_ABI,
        functionName: 'setMessage',
        args: [newMessage],
        account,
        //  legacy transaction parameters
        type: 'legacy',
        gasPrice: gasPrice,
        gas: gasEstimate + BigInt(50000), 
      });

      // to await confirmation
      await publicClient.waitForTransactionReceipt({ hash });
      
      // to read the updated message
      const result = await publicClient.readContract({
        address: getAddress(CONTRACT_ADDRESS),
        abi: MESSAGE_CONTRACT_ABI,
        functionName: 'getMessage',
      });
      
      setMessage(result as string);
      setNewMessage('');
      
      alert('Message updated successfully!');
    } catch (error: unknown) {
      console.error('Error writing message:', error);
      
      // error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as { code?: string | number })?.code;
      
      if (errorCode === 'ACTION_REJECTED' || errorCode === 4001) {
        alert('Transaction was cancelled by user.');
      } else if (errorMessage.includes('insufficient funds')) {
        alert('Insufficient tRBTC for gas fees. Please acquire tRBTC from the testnet faucet.');
      } else if (errorMessage.includes('execution reverted')) {
        alert('Transaction failed. Please check the contract and try again.');
      } else {
        alert('Error writing message. Make sure you have tRBTC for gas fees or check if the contract is deployed.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!ready || !authenticated) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please log in to send a Message</p>
      </div>
    );
  }

  if (!embeddedWallet) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 font-bold">No embedded wallet found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Message Contract</h2>
      <div className="text-sm text-gray-600 mb-4 space-y-1">
        <p><strong>Network:</strong> Rootstock Testnet | <strong>Wallet:</strong> {embeddedWallet.address?.slice(0, 6)}...{embeddedWallet.address?.slice(-4)}</p>
        <p><strong>Balance:</strong> {balance || '...'} tRBTC {parseFloat(balance) < 0.00005 && balance !== '' && (
          <span className="text-red-600 text-xs">
            ( Low balance - Get tRBTC from the testnet faucet)
          </span>
        )}</p>
      </div>
      
      <div className="space-y-4">
       
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Current Message:</h3>
          <div className="bg-gray-100 p-3 rounded-md">
            <p className="text-gray-800">{message || 'No message loaded'}</p>
          </div>
          <button
            onClick={readMessage}
            disabled={loading}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Loading...' : 'Read Message'}
          </button>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Set New Message:</h3>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter your message..."
            className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={writeMessage}
            disabled={loading || !newMessage.trim()}
            className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Set Message'}
          </button>
        </div>

     
      </div>
    </div>
  );
}
