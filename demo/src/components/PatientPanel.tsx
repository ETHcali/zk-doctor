/**
 * PatientPanel - Interfaz para que el paciente vea y descifre sus resultados médicos
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
      setStatus('Por favor conecta tu wallet primero');
      return;
    }

    setIsLoading(true);
    setStatus('🔍 Consultando Arkiv...');

    try {
      const results = await getPatientResults(wallet.address);
      setMedicalResults(results);
      
      if (results.length === 0) {
        setStatus('No se encontraron resultados médicos para esta wallet');
      } else {
        setStatus(`✅ Se encontraron ${results.length} resultado(s) médico(s)`);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      setStatus(`❌ Error consultando resultados: ${error}`);
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
    setStatus('🔓 Descifrando resultado...');
    setSelectedResult(result);

    try {
      // Deserialize token
      const token = deserializeToken(result.encryptedToken);
      
      // Decrypt
      const medicalData = decryptMedicalToken(token, wallet.address);
      
      setDecryptedData(medicalData);
      setStatus('✅ Resultado descifrado exitosamente!');
      
    } catch (error) {
      console.error('Error decrypting:', error);
      setStatus(`❌ Error descifrando: Solo el paciente autorizado puede descifrar este resultado`);
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
      <h2>🏥 Patient Panel</h2>

      {/* Wallet Status */}
      {!wallet.address ? (
        <div style={{
          background: '#fff3cd',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem' }}>
            🔒 Por favor conecta tu wallet para ver tus resultados médicos
          </p>
        </div>
      ) : (
        <div style={{
          background: '#c8e6c9',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            ✅ Conectado como Paciente
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', fontFamily: 'monospace' }}>
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
            background: isLoading ? '#ccc' : '#4CAF50',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '⏳ Cargando...' : '🔄 Actualizar Resultados'}
        </button>
      )}

      {/* Status */}
      {status && (
        <div style={{
          padding: '1rem',
          background: status.includes('✅') ? '#c8e6c9' : 
                     status.includes('❌') ? '#ffcdd2' : '#fff3cd',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0 }}>{status}</p>
        </div>
      )}

      {/* Results List */}
      {medicalResults.length > 0 && (
        <div className="section">
          <h3>📋 Mis Resultados Médicos ({medicalResults.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {medicalResults.map((result, index) => (
              <div
                key={result.entityKey}
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: selectedResult?.entityKey === result.entityKey ? '#e3f2fd' : '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>
                      📄 Resultado #{index + 1}
                    </h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Doctor:</strong> {result.doctor}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                      <strong>Fecha:</strong> {formatDate(result.timestamp)}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                      <strong>Entity Key:</strong> {result.entityKey.slice(0, 20)}...
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDecrypt(result)}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      background: isLoading ? '#ccc' : '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedResult?.entityKey === result.entityKey && decryptedData
                      ? '✓ Descifrado'
                      : '🔓 Descifrar'}
                  </button>
                </div>

                {/* Decrypted Data */}
                {selectedResult?.entityKey === result.entityKey && decryptedData && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    border: '2px solid #4CAF50'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#4CAF50' }}>
                      🔓 Resultado Descifrado
                    </h4>
                    
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      <div>
                        <strong>Paciente:</strong> {decryptedData.patientName}
                      </div>
                      <div>
                        <strong>Tipo de Test:</strong> {decryptedData.testType}
                      </div>
                      <div>
                        <strong>Fecha del Test:</strong> {decryptedData.date}
                      </div>
                      
                      {Object.keys(decryptedData.results).length > 0 && (
                        <div>
                          <strong>Resultados:</strong>
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
                          <strong>Notas Clínicas:</strong>
                          <p style={{ 
                            margin: '0.5rem 0 0 0', 
                            padding: '0.5rem', 
                            background: 'white', 
                            borderRadius: '4px',
                            fontStyle: 'italic'
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
          color: '#999'
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>📭</p>
          <p style={{ fontSize: '1.1rem', margin: 0 }}>
            No tienes resultados médicos aún
          </p>
          <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
            Los resultados aparecerán aquí cuando tu doctor los cree
          </p>
        </div>
      )}

      {/* Info Box */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <h4 style={{ marginTop: 0 }}>ℹ️ Cómo funciona:</h4>
        <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Conecta tu wallet (MetaMask u otra)</li>
          <li>El sistema consulta Arkiv para tus resultados médicos</li>
          <li>Haz clic en "Descifrar" para ver el contenido</li>
          <li>Solo tu wallet privada puede descifrar tus resultados</li>
        </ol>
      </div>
    </div>
  );
}

export default PatientPanel;
