/**
 * DoctorPanel - Interfaz para que el doctor cree resultados médicos cifrados
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
    // Validar
    if (!patientName || !patientWallet || !testType) {
      alert('Por favor completa al menos: Nombre, Wallet y Tipo de Test');
      return;
    }

    // Validar wallet format
    if (!patientWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('Wallet address inválida. Debe ser formato 0x...');
      return;
    }

    setIsLoading(true);
    setStatus('🔐 Generando token cifrado...');

    try {
      // Construir datos médicos
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

      // Generar token cifrado
      const encryptedToken = generateMedicalToken(medicalData);
      const tokenString = serializeToken(encryptedToken);

      setStatus('📤 Guardando en Arkiv...');

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

      setEntityKey(receipt.entityKey);
      setTxHash(receipt.transactionHash);
      setStatus('✅ Resultado médico guardado exitosamente en Arkiv!');

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
      setStatus(`❌ Error: ${error}`);
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
      <h2>🏥 Doctor Panel</h2>
      
      {/* Doctor Session Info */}
      <div style={{
        background: '#e3f2fd',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          👨‍⚕️ Logged in as: {DOCTOR_NAME}
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
          ID: {DOCTOR_ID}
        </p>
      </div>

      {/* Patient Info */}
      <div className="section">
        <h3>📋 Patient Information</h3>
        
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
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '-0.5rem' }}>
          Solo el paciente con esta wallet podrá descifrar el resultado
        </p>
      </div>

      {/* Test Info */}
      <div className="section">
        <h3>🔬 Test Information</h3>

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
          background: isLoading ? '#ccc' : '#2196F3',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? '⏳ Processing...' : '🔐 Generate Encrypted Result'}
      </button>

      {/* Status */}
      {status && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: status.includes('✅') ? '#c8e6c9' : 
                     status.includes('❌') ? '#ffcdd2' : '#fff3cd',
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0 }}>{status}</p>
          
          {entityKey && (
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <p style={{ margin: '0.5rem 0' }}>
                <strong>Entity Key:</strong>
                <br />
                <code style={{ 
                  background: '#f5f5f5', 
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all'
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
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <h4 style={{ marginTop: 0 }}>ℹ️ How it works:</h4>
        <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Complete el formulario con los datos médicos</li>
          <li>El sistema cifra los datos con la wallet del paciente</li>
          <li>El resultado se guarda en Arkiv (data layer de Polkadot)</li>
          <li>Solo el paciente puede descifrar con su wallet privada</li>
        </ol>
      </div>
    </div>
  );
}

export default DoctorPanel;
