/**
 * Test específico: Misma wallet para encriptar y desencriptar
 * 
 * Este test verifica el escenario exacto del usuario:
 * 1. Doctor crea token con wallet del paciente
 * 2. Paciente conecta con ESA MISMA wallet
 * 3. Paciente intenta desencriptar
 */

import { describe, it, expect } from 'vitest';
import {
  generateMedicalToken,
  decryptMedicalToken,
  serializeToken,
  deserializeToken,
  type MedicalData
} from '../services/medicalTokenService';

describe('Same Wallet Encryption/Decryption Test', () => {
  
  it('should encrypt with wallet A and decrypt with same wallet A', () => {
    // PASO 1: Definir la wallet del paciente
    const PATIENT_WALLET = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    
    // PASO 2: Doctor crea datos médicos con esa wallet
    const medicalData: MedicalData = {
      patientName: 'Test Patient',
      patientWallet: PATIENT_WALLET, // ← Wallet usada para encriptar
      testType: 'Blood Test',
      results: {
        hemoglobin: '14.5 g/dL',
        glucose: '95 mg/dL'
      },
      date: '2025-11-16',
      notes: 'Test results'
    };

    console.log('🔐 STEP 1: Doctor creates encrypted token');
    console.log('   Patient Wallet:', PATIENT_WALLET);
    
    // PASO 3: Generar token encriptado
    const token = generateMedicalToken(medicalData);
    console.log('   Token generated:', {
      version: token.version,
      encrypted_length: token.encrypted.length,
      iv_length: token.iv.length,
      timestamp: token.timestamp
    });
    
    // PASO 4: Serializar (simula guardado en Arkiv)
    const serialized = serializeToken(token);
    console.log('   Serialized length:', serialized.length);
    
    // PASO 5: Deserializar (simula recuperación desde Arkiv)
    const retrieved = deserializeToken(serialized);
    console.log('🔓 STEP 2: Patient retrieves from Arkiv');
    
    // PASO 6: Paciente intenta desencriptar con LA MISMA wallet
    console.log('🔓 STEP 3: Patient decrypts with same wallet');
    console.log('   Decrypt Wallet:', PATIENT_WALLET);
    
    let decrypted: MedicalData;
    try {
      decrypted = decryptMedicalToken(retrieved, PATIENT_WALLET);
      console.log('   ✅ Decryption SUCCESS!');
    } catch (error) {
      console.error('   ❌ Decryption FAILED:', error);
      throw error;
    }
    
    // PASO 7: Verificar que los datos son correctos
    console.log('🔍 STEP 4: Verify decrypted data');
    console.log('   Patient Name:', decrypted.patientName);
    console.log('   Test Type:', decrypted.testType);
    console.log('   Results:', decrypted.results);
    
    // Assertions
    expect(decrypted.patientName).toBe('Test Patient');
    expect(decrypted.patientWallet).toBe(PATIENT_WALLET);
    expect(decrypted.testType).toBe('Blood Test');
    expect(decrypted.results.hemoglobin).toBe('14.5 g/dL');
    expect(decrypted.results.glucose).toBe('95 mg/dL');
    expect(decrypted.date).toBe('2025-11-16');
    expect(decrypted.notes).toBe('Test results');
    
    console.log('   ✅ All data matches!');
  });

  it('should handle case-insensitive wallet addresses', () => {
    const WALLET_LOWER = '0x7d70253e702954ef9ac2c0d74f9be35f15524821';
    const WALLET_UPPER = '0x7D70253E702954EF9AC2C0D74F9BE35F15524821';
    const WALLET_MIXED = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    
    console.log('🔐 Testing case insensitivity');
    
    // Create with lowercase
    const medicalData: MedicalData = {
      patientName: 'Case Test Patient',
      patientWallet: WALLET_LOWER,
      testType: 'Blood Test',
      results: { test: 'value' },
      date: '2025-11-16'
    };
    
    const token = generateMedicalToken(medicalData);
    
    // Decrypt with uppercase - should work
    console.log('   Trying uppercase wallet...');
    const decrypted1 = decryptMedicalToken(token, WALLET_UPPER);
    expect(decrypted1.patientName).toBe('Case Test Patient');
    console.log('   ✅ Uppercase works');
    
    // Decrypt with mixed case - should work
    console.log('   Trying mixed case wallet...');
    const decrypted2 = decryptMedicalToken(token, WALLET_MIXED);
    expect(decrypted2.patientName).toBe('Case Test Patient');
    console.log('   ✅ Mixed case works');
  });

  it('should detect if wallet mismatch occurs', () => {
    const CORRECT_WALLET = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    const WRONG_WALLET = '0x1234567890123456789012345678901234567890';
    
    console.log('🔐 Testing wallet mismatch detection');
    console.log('   Correct wallet:', CORRECT_WALLET);
    console.log('   Wrong wallet:', WRONG_WALLET);
    
    // Create with correct wallet
    const medicalData: MedicalData = {
      patientName: 'Test Patient',
      patientWallet: CORRECT_WALLET,
      testType: 'Blood Test',
      results: { test: 'value' },
      date: '2025-11-16'
    };
    
    const token = generateMedicalToken(medicalData);
    
    // Try to decrypt with wrong wallet - should fail
    console.log('   Attempting decrypt with WRONG wallet...');
    expect(() => {
      decryptMedicalToken(token, WRONG_WALLET);
    }).toThrow();
    console.log('   ✅ Correctly rejected wrong wallet');
    
    // Decrypt with correct wallet - should work
    console.log('   Attempting decrypt with CORRECT wallet...');
    const decrypted = decryptMedicalToken(token, CORRECT_WALLET);
    expect(decrypted.patientName).toBe('Test Patient');
    console.log('   ✅ Correctly accepted correct wallet');
  });

  it('should reproduce exact user scenario step-by-step', () => {
    console.log('\n=== REPRODUCING USER SCENARIO ===\n');
    
    // Wallet from user's screenshot
    const USER_WALLET = '0x7d70253e702954ef9ac2c0d74f9be35f15524821';
    
    console.log('SCENARIO: User creates medical result and tries to decrypt');
    console.log('Patient Wallet:', USER_WALLET);
    console.log('');
    
    // STEP 1: Doctor creates
    console.log('📋 STEP 1: Doctor creates medical result');
    const doctorData: MedicalData = {
      patientName: 'Test Patient',
      patientWallet: USER_WALLET,
      testType: 'Blood Test',
      results: {
        hemoglobin: '14.5 g/dL'
      },
      date: '2025-11-16',
      notes: 'Test'
    };
    
    const token = generateMedicalToken(doctorData);
    console.log('   Token created with wallet:', USER_WALLET);
    console.log('   Token encrypted:', token.encrypted.substring(0, 20) + '...');
    console.log('   Token IV:', token.iv.substring(0, 20) + '...');
    console.log('');
    
    // STEP 2: Save to Arkiv (simulate)
    console.log('💾 STEP 2: Backend saves to Arkiv');
    const arkivPayload = serializeToken(token);
    console.log('   Payload size:', arkivPayload.length, 'bytes');
    console.log('');
    
    // STEP 3: Patient retrieves from Arkiv
    console.log('🔍 STEP 3: Patient queries Arkiv');
    const retrievedToken = deserializeToken(arkivPayload);
    console.log('   Retrieved token version:', retrievedToken.version);
    console.log('   Retrieved token timestamp:', retrievedToken.timestamp);
    console.log('');
    
    // STEP 4: Patient attempts to decrypt
    console.log('🔓 STEP 4: Patient attempts to decrypt');
    console.log('   Patient wallet connected:', USER_WALLET);
    console.log('   Attempting decryption...');
    
    let decrypted: MedicalData;
    try {
      decrypted = decryptMedicalToken(retrievedToken, USER_WALLET);
      console.log('   ✅ DECRYPTION SUCCESSFUL!');
      console.log('');
      console.log('📄 STEP 5: Display decrypted data');
      console.log('   Patient Name:', decrypted.patientName);
      console.log('   Patient Wallet:', decrypted.patientWallet);
      console.log('   Test Type:', decrypted.testType);
      console.log('   Results:', JSON.stringify(decrypted.results));
      console.log('   Date:', decrypted.date);
      console.log('   Notes:', decrypted.notes);
    } catch (error) {
      console.error('   ❌ DECRYPTION FAILED!');
      console.error('   Error:', error);
      throw new Error(`Decryption should have worked but failed: ${error}`);
    }
    
    // Verify
    expect(decrypted!.patientWallet.toLowerCase()).toBe(USER_WALLET.toLowerCase());
    expect(decrypted!.patientName).toBe('Test Patient');
    
    console.log('');
    console.log('=== SCENARIO COMPLETED SUCCESSFULLY ===\n');
  });

  it('should debug key derivation process', () => {
    const WALLET = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    
    console.log('🔍 Debugging key derivation for wallet:', WALLET);
    
    // Simulate key derivation
    const normalized = WALLET.toLowerCase().replace('0x', '');
    console.log('   Normalized (no 0x, lowercase):', normalized);
    console.log('   Length:', normalized.length);
    
    const repeated = normalized.repeat(Math.ceil(64 / normalized.length)).substring(0, 64);
    console.log('   Repeated to 64 chars:', repeated);
    console.log('   Final length:', repeated.length);
    
    // Create two tokens with same data
    const data1: MedicalData = {
      patientName: 'Test',
      patientWallet: WALLET,
      testType: 'Test',
      results: {},
      date: '2025-11-16'
    };
    
    const data2: MedicalData = {
      patientName: 'Test',
      patientWallet: WALLET.toLowerCase(), // lowercase version
      testType: 'Test',
      results: {},
      date: '2025-11-16'
    };
    
    const token1 = generateMedicalToken(data1);
    const token2 = generateMedicalToken(data2);
    
    console.log('   Token 1 IV:', token1.iv);
    console.log('   Token 2 IV:', token2.iv);
    console.log('   IVs are different (random):', token1.iv !== token2.iv);
    
    // Both should decrypt with either case
    const decrypted1a = decryptMedicalToken(token1, WALLET);
    const decrypted1b = decryptMedicalToken(token1, WALLET.toLowerCase());
    const decrypted2a = decryptMedicalToken(token2, WALLET);
    const decrypted2b = decryptMedicalToken(token2, WALLET.toLowerCase());
    
    expect(decrypted1a.patientName).toBe('Test');
    expect(decrypted1b.patientName).toBe('Test');
    expect(decrypted2a.patientName).toBe('Test');
    expect(decrypted2b.patientName).toBe('Test');
    
    console.log('   ✅ All combinations work correctly');
  });
});
