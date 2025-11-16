import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import './App.css';
import SenderPanel from './components/SenderPanel';
import ReceiverPanel from './components/ReceiverPanel';

interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
}

type Mode = 'sender' | 'receiver';

function App() {
  const [wallet, setWallet] = useState<WalletState>({ address: null, provider: null });
  const [mode, setMode] = useState<Mode>('sender');

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setWallet({ address: accounts[0], provider });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setWallet({ address: null, provider: null });
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div className="App">
      <div className="wallet-toggle">
        {!wallet.address ? (
          <button onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <button onClick={disconnectWallet} className="connected">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </button>
        )}
      </div>

      <header className="app-header">
        <h1>ZKPJWT</h1>
        <p className="tagline">The ancient JWT from Web2 with the power of ZKP</p>
        <p className="subtitle">A Web2-friendly library</p>
      </header>

      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'sender' ? 'active' : ''}`}
          onClick={() => switchMode('sender')}
        >
          Sender (Create Token)
        </button>
        <button 
          className={`mode-btn ${mode === 'receiver' ? 'active' : ''}`}
          onClick={() => switchMode('receiver')}
        >
          Receiver (Decrypt)
        </button>
      </div>

      <div className="main-container">
        {mode === 'sender' ? (
          <SenderPanel wallet={wallet} />
        ) : (
          <ReceiverPanel wallet={wallet} />
        )}
      </div>

      <footer className="app-footer">
        <p>Built for Arbitrum ARG25 Program</p>
        <p>
          <a href="https://github.com/DevCristobalvc/zkp-jwt" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' | '}
          <a href="https://docs.arbitrum.io/stylus" target="_blank" rel="noopener noreferrer">
            Arbitrum Stylus
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
