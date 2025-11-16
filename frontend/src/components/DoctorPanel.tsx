/**
 * DoctorPanel - Interface for doctors to create encrypted medical results
 */

import { useState } from 'react';
import { generateMedicalToken, serializeToken, type MedicalData } from '../services/medicalTokenService';
import { saveMedicalResult } from '../services/arkivService';

function DoctorPanel() {
  // Mock doctor session
  const DOCTOR_ID = 'dr_smith_001';
  const DOCTOR_NAME = 'Dr. Sarah Smith';

  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientWallet, setPatientWallet] = useState('');
  const [testType, setTestType] = useState('Blood Test');
  const [resultField1, setResultField1] = useState('');
  const [resultValue1, setResultValue1] = useState('');
  const [resultField2, setResultField2] = useState('');
  const [resultValue2, setResultValue2] = useState('');
  const [notes, setNotes] = useState('');
  
  // Status
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [entityKey, setEntityKey] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleGenerateResult = async () => {
    // Validate
    if (!patientName || !patientWallet || !testType) {
      alert('Please complete at least: Name, Wallet and Test Type');
      return;
    }

    // Validate wallet format
    if (!patientWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Invalid wallet address. Must be 0x... format');
      return;
    }

    setIsLoading(true);
    setStatus('Generating encrypted token...');

    console.log('🔐 CREATING MEDICAL RESULT');
    console.log('  Patient Name:', patientName);
    console.log('  Patient Wallet:', patientWallet);
    console.log('  Test Type:', testType);
    console.log('  ⚠️  IMPORTANT: Token will be encrypted with this wallet:', patientWallet);
    console.log('  ⚠️  Only this wallet will be able to decrypt the result!');

    try {
      // Build medical data
      const results: Record<string, string> = {};
      if (resultField1 && resultValue1) {
        results[resultField1] = resultValue1;
      }
      if (resultField2 && resultValue2) {
        results[resultField2] = resultValue2;
      }

      const medicalData: MedicalData = {
        patientName,
        patientWallet,
        testType,
        results,
        date: new Date().toISOString().split('T')[0],
        notes: notes || undefined
      };

      console.log('  Step 1: Generating encrypted token...');
      // Generar token cifrado
      const encryptedToken = generateMedicalToken(medicalData);
      const tokenString = serializeToken(encryptedToken);
      console.log('  Token generated - Size:', tokenString.length, 'bytes');

      setStatus('Saving to Arkiv...');
      console.log('  Step 2: Saving to Arkiv...');

      // Guardar en Arkiv
      const receipt = await saveMedicalResult(
        tokenString,
        {
          doctorId: DOCTOR_ID,
          patientWallet,
          timestamp: encryptedToken.timestamp
        },
        30 // 30 días de expiración
      );

      console.log('  ✅ SUCCESS!');
      console.log('  Entity Key:', receipt.entityKey);
      console.log('  TX Hash:', receipt.transactionHash);
      console.log('');
      console.log('  📝 REMEMBER: This result can ONLY be decrypted by wallet:', patientWallet);

      setEntityKey(receipt.entityKey);
      setTxHash(receipt.transactionHash);
      setStatus('SUCCESS: Medical result saved successfully to Arkiv!');

      // Limpiar formulario
      setTimeout(() => {
        setPatientName('');
        setPatientWallet('');
        setResultField1('');
        setResultValue1('');
        setResultField2('');
        setResultValue2('');
        setNotes('');
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      // User-friendly error messages
      if (errorMsg.includes('WebAssembly') || errorMsg.includes('magic word')) {
        setStatus('Error: Arkiv SDK configuration issue. Mendoza testnet may be offline or SDK version needs update. For now, encryption works but cannot save to Arkiv.');
      } else if (errorMsg.includes('network')) {
        setStatus('Network error. Check your internet connection.');
      } else {
        setStatus(`Error: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testTypes = [
    'Blood Test',
    'Urine Test',
    'X-Ray',
    'MRI',
    'CT Scan',
    'ECG',
    'Other'
  ];

  return (
    <div className="panel">
      <h2>Doctor Panel</h2>
      
      {/* Doctor Session Info */}
      <div style={{
        background: '#1a472a',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        border: '2px solid #2e7d46'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: '#4ade80' }}>
          Logged in as: {DOCTOR_NAME}
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#86efac' }}>
          ID: {DOCTOR_ID}
        </p>
      </div>

      {/* Patient Info */}
      <div className="section">
        <h3>Patient Information</h3>
        
        <label>
          Patient Name *
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </label>

        <label>
          Patient Wallet Address *
          <input
            type="text"
            value={patientWallet}
            onChange={(e) => setPatientWallet(e.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb..."
            disabled={isLoading}
          />
        </label>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '-0.5rem' }}>
          Only the patient with this wallet will be able to decrypt the result
        </p>
      </div>

      {/* Test Info */}
      <div className="section">
        <h3>Test Information</h3>

        <label>
          Test Type *
          <select 
            value={testType} 
            onChange={(e) => setTestType(e.target.value)}
            disabled={isLoading}
          >
            {testTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label>
          Result Field 1 (e.g., "Glucose")
          <input
            type="text"
            value={resultField1}
            onChange={(e) => setResultField1(e.target.value)}
            placeholder="Glucose"
            disabled={isLoading}
          />
        </label>

        <label>
          Value 1 (e.g., "95 mg/dL")
          <input
            type="text"
            value={resultValue1}
            onChange={(e) => setResultValue1(e.target.value)}
            placeholder="95 mg/dL"
            disabled={isLoading}
          />
        </label>

        <label>
          Result Field 2 (e.g., "Cholesterol")
          <input
            type="text"
            value={resultField2}
            onChange={(e) => setResultField2(e.target.value)}
            placeholder="Cholesterol"
            disabled={isLoading}
          />
        </label>

        <label>
          Value 2 (e.g., "180 mg/dL")
          <input
            type="text"
            value={resultValue2}
            onChange={(e) => setResultValue2(e.target.value)}
            placeholder="180 mg/dL"
            disabled={isLoading}
          />
        </label>

        <label>
          Clinical Notes (Optional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Patient is healthy. No abnormalities detected."
            rows={3}
            disabled={isLoading}
          />
        </label>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleGenerateResult}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: isLoading ? '#475569' : '#2196F3',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Processing...' : 'Generate Encrypted Result'}
      </button>

      {/* Status */}
      {status && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: status.includes('success') ? '#1a472a' : 
                     status.includes('Error') ? '#7f1d1d' : '#422006',
          borderRadius: '8px',
          border: status.includes('success') ? '2px solid #2e7d46' :
                  status.includes('Error') ? '2px solid #dc2626' : '2px solid #92400e',
          color: status.includes('success') ? '#4ade80' :
                 status.includes('Error') ? '#fca5a5' : '#fbbf24'
        }}>
          <p style={{ margin: 0 }}>{status}</p>
          
          {entityKey && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Entity Key:</strong>
                <br />
                <code style={{ 
                  background: '#1e293b', 
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                  color: '#60a5fa'
                }}>
                  {entityKey}
                </code>
              </p>
              {txHash !== 'N/A' && (
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>Transaction:</strong> {txHash.slice(0, 10)}...
                </p>
              )}
            </div>
          )}
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
          <li>Complete the form with medical data</li>
          <li>The system encrypts data with the patient's wallet</li>
          <li>The result is saved to Arkiv (Polkadot data layer)</li>
          <li>Only the patient can decrypt with their private wallet</li>
        </ol>
      </div>
    </div>
  );
}

export default DoctorPanel;
