/**
 * PatientPanel - Interface for patients to view and decrypt their medical results
 */

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { getPatientResults, type MedicalResult } from '../services/arkivService';
import { decryptMedicalToken, deserializeToken, type MedicalData } from '../services/medicalTokenService';

interface WalletState {
  address: string | null;
  provider: BrowserProvider | null;
}

interface PatientPanelProps {
  wallet: WalletState;
}

function PatientPanel({ wallet }: PatientPanelProps) {
  const [medicalResults, setMedicalResults] = useState<MedicalResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<MedicalResult | null>(null);
  const [decryptedData, setDecryptedData] = useState<MedicalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  // Auto-load results when wallet connects
  useEffect(() => {
    if (wallet.address) {
      loadResults();
    } else {
      setMedicalResults([]);
      setSelectedResult(null);
      setDecryptedData(null);
    }
  }, [wallet.address]);

  const loadResults = async () => {
    if (!wallet.address) {
      setStatus('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setStatus('Querying Arkiv...');

    try {
      const results = await getPatientResults(wallet.address);
      setMedicalResults(results);
      
      if (results.length === 0) {
        setStatus('No medical results found for this wallet');
      } else {
        setStatus(`SUCCESS: Found ${results.length} medical result(s)`);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      setStatus(`Error querying results: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async (result: MedicalResult) => {
    if (!wallet.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setStatus('Decrypting result...');
    setSelectedResult(result);

    console.log('🔓 ATTEMPTING DECRYPTION');
    console.log('  Connected Wallet:', wallet.address);
    console.log('  Entity Key:', result.entityKey);
    console.log('  Doctor:', result.doctor);
    console.log('  Timestamp:', result.timestamp);

    try {
      // Deserialize token
      console.log('  Step 1: Deserializing token...');
      const token = deserializeToken(result.encryptedToken);
      console.log('  Token Version:', token.version);
      console.log('  Token IV Length:', token.iv.length);
      console.log('  Token Encrypted Length:', token.encrypted.length);
      
      // Decrypt
      console.log('  Step 2: Attempting decryption with wallet:', wallet.address);
      const medicalData = decryptMedicalToken(token, wallet.address);
      
      console.log('  ✅ DECRYPTION SUCCESS!');
      console.log('  Patient Name:', medicalData.patientName);
      console.log('  Patient Wallet from data:', medicalData.patientWallet);
      console.log('  Test Type:', medicalData.testType);
      
      setDecryptedData(medicalData);
      setStatus('SUCCESS: Result decrypted successfully!');
      
    } catch (error) {
      console.error('❌ DECRYPTION FAILED');
      console.error('  Error:', error);
      console.error('  Error name:', (error as Error).name);
      console.error('  Error message:', (error as Error).message);
      console.error('');
      console.error('🔍 DEBUGGING HINTS:');
      console.error('  1. Check if the wallet you connected with is the SAME wallet');
      console.error('     that the doctor entered when creating this result');
      console.error('  2. Your connected wallet:', wallet.address);
      console.error('  3. This result was created for a DIFFERENT wallet');
      console.error('');
      console.error('💡 SOLUTION: Ask the doctor what wallet address they used,');
      console.error('   or create a new medical result using YOUR current wallet');
      
      setStatus(`Error decrypting: This result was encrypted for a different wallet. Only the wallet used during creation can decrypt.`);
      setDecryptedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="panel">
      <h2>Patient Panel</h2>

      {/* Wallet Status */}
      {!wallet.address ? (
        <div style={{
          background: '#422006',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center',
          border: '2px solid #92400e'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24' }}>
            Please connect your wallet to view your medical results
          </p>
        </div>
      ) : (
        <div style={{
          background: '#1a472a',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '2px solid #2e7d46'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#4ade80' }}>
            Connected as Patient
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', fontFamily: 'monospace', color: '#86efac' }}>
            {wallet.address}
          </p>
        </div>
      )}

      {/* Refresh Button */}
      {wallet.address && (
        <button
          onClick={loadResults}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            background: isLoading ? '#475569' : '#4CAF50',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Loading...' : 'Refresh Results'}
        </button>
      )}

      {/* Status */}
      {status && (
        <div style={{
          padding: '1rem',
          background: status.includes('SUCCESS') ? '#1a472a' : 
                     status.includes('Error') ? '#7f1d1d' : '#422006',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: status.includes('SUCCESS') ? '2px solid #2e7d46' :
                  status.includes('Error') ? '2px solid #dc2626' : '2px solid #92400e',
          color: status.includes('SUCCESS') ? '#4ade80' :
                 status.includes('Error') ? '#fca5a5' : '#fbbf24'
        }}>
          <p style={{ margin: 0 }}>{status}</p>
        </div>
      )}

      {/* Results List */}
      {medicalResults.length > 0 && (
        <div className="section">
          <h3>My Medical Results ({medicalResults.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {medicalResults.map((result, index) => (
              <div
                key={result.entityKey}
                style={{
                  border: '2px solid #334155',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: selectedResult?.entityKey === result.entityKey ? '#1e3a5f' : '#1e293b'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>
                      Result #{index + 1}
                    </h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Doctor:</strong> {result.doctor}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Date:</strong> {formatDate(result.timestamp)}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                      <strong>Entity Key:</strong> {result.entityKey.slice(0, 20)}...
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDecrypt(result)}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      background: isLoading ? '#475569' : '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedResult?.entityKey === result.entityKey && decryptedData
                      ? 'Decrypted'
                      : 'Decrypt'}
                  </button>
                </div>

                {/* Decrypted Data */}
                {selectedResult?.entityKey === result.entityKey && decryptedData && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#1e293b',
                    borderRadius: '8px',
                    border: '2px solid #4CAF50'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#4CAF50' }}>
                      Decrypted Result
                    </h4>
                    
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div>
                        <strong>Patient:</strong> {decryptedData.patientName}
                      </div>
                      <div>
                        <strong>Test Type:</strong> {decryptedData.testType}
                      </div>
                      <div>
                        <strong>Test Date:</strong> {decryptedData.date}
                      </div>
                      
                      {Object.keys(decryptedData.results).length > 0 && (
                        <div>
                          <strong>Results:</strong>
                          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                            {Object.entries(decryptedData.results).map(([key, value]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {value}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {decryptedData.notes && (
                        <div>
                          <strong>Clinical Notes:</strong>
                          <p style={{ 
                            margin: '0.5rem 0 0 0', 
                            padding: '0.5rem', 
                            background: '#0f172a', 
                            borderRadius: '4px',
                            fontStyle: 'italic',
                            border: '1px solid #334155'
                          }}>
                            {decryptedData.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {wallet.address && medicalResults.length === 0 && !isLoading && (
        <div style={{
          padding: '3rem 1rem',
          textAlign: 'center',
          color: '#94a3b8',
          background: '#1e293b',
          borderRadius: '8px',
          border: '1px dashed #334155'
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}></p>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>
            No medical results yet
          </p>
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
            Results will appear here when your doctor creates them
          </p>
        </div>
      )}

      {/* Info Box */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#1e293b',
        borderRadius: '8px',
        fontSize: '0.9rem',
        border: '1px solid #334155'
      }}>
        <h4 style={{ marginTop: 0 }}>How it works:</h4>
        <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Connect your wallet (MetaMask or other)</li>
          <li>The system queries Arkiv for your medical results</li>
          <li>Click "Decrypt" to view the content</li>
          <li>Only your private wallet can decrypt your results</li>
        </ol>
      </div>
    </div>
  );
}

export default PatientPanel;
