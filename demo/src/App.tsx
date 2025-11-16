import { useState } from 'react';
import { BrowserProvider } from 'ethers';
import './App.css';
import DoctorPanel from './components/DoctorPanel';
import PatientPanel from './components/PatientPanel';

interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
}

type Mode = 'doctor' | 'patient';

function App() {
  const [wallet, setWallet] = useState<WalletState>({ address: null, provider: null });
  const [mode, setMode] = useState<Mode>('doctor');

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
        <h1>🏥 zk-doctor</h1>
        <p className="tagline">Private Medical Results on Arkiv</p>
        <p className="subtitle">Encrypted healthcare data powered by Zero-Knowledge + Polkadot</p>
      </header>

      <div className="mode-selector">
        <button 
          className={`mode-btn ${mode === 'doctor' ? 'active' : ''}`}
          onClick={() => switchMode('doctor')}
        >
          👨‍⚕️ Doctor
        </button>
        <button 
          className={`mode-btn ${mode === 'patient' ? 'active' : ''}`}
          onClick={() => switchMode('patient')}
        >
          👤 Patient
        </button>
      </div>

      <div className="main-container">
        {mode === 'doctor' ? (
          <DoctorPanel />
        ) : (
          <PatientPanel wallet={wallet} />
        )}
      </div>

      <footer className="app-footer">
        <p>Built for Sub0 Polkadot Hackathon - Arkiv Track</p>
        <p>
          <a href="https://github.com/ETHcali/zk-doctor" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {' | '}
          <a href="https://arkiv.dev.golem.network/docs" target="_blank" rel="noopener noreferrer">
            Arkiv Docs
          </a>
          {' | '}
          <a href="https://hack.sub0.gg/" target="_blank" rel="noopener noreferrer">
            Sub0 Hackathon
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
