/**
 * Unit Tests for Medical Token Service
 * 
 * Tests encryption/decryption flow to verify token security
 */

import { describe, it, expect } from 'vitest';
import {
  generateMedicalToken,
  decryptMedicalToken,
  serializeToken,
  deserializeToken,
  isValidToken,
  type MedicalData
} from '../services/medicalTokenService';

describe('Medical Token Service', () => {
  const PATIENT_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  const WRONG_WALLET = '0x1234567890123456789012345678901234567890';

  const sampleMedicalData: MedicalData = {
    patientName: 'John Doe',
    patientWallet: PATIENT_WALLET,
    testType: 'Blood Test',
    results: {
      hemoglobin: '14.5 g/dL',
      glucose: '95 mg/dL'
    },
    date: '2025-11-16',
    notes: 'Patient is healthy'
  };

  describe('Token Generation', () => {
    it('should generate a valid encrypted token', () => {
      const token = generateMedicalToken(sampleMedicalData);

      expect(token).toBeDefined();
      expect(token.version).toBe('1.0.0');
      expect(token.encrypted).toBeTruthy();
      expect(token.iv).toBeTruthy();
      expect(token.timestamp).toBeGreaterThan(0);
      expect(isValidToken(token)).toBe(true);
    });

    it('should generate different IVs for same data', () => {
      const token1 = generateMedicalToken(sampleMedicalData);
      const token2 = generateMedicalToken(sampleMedicalData);

      // IVs should be different (randomized)
      expect(token1.iv).not.toBe(token2.iv);
      // Encrypted data should be different due to different IVs
      expect(token1.encrypted).not.toBe(token2.encrypted);
    });

    it('should handle special characters in data', () => {
      const dataWithSpecialChars: MedicalData = {
        ...sampleMedicalData,
        patientName: 'María José García',
        notes: 'Test with émojis 🩺 and symbols: @#$%^&*()'
      };

      const token = generateMedicalToken(dataWithSpecialChars);
      expect(token).toBeDefined();
      expect(isValidToken(token)).toBe(true);
    });
  });

  describe('Token Decryption', () => {
    it('should decrypt token with correct patient wallet', () => {
      const token = generateMedicalToken(sampleMedicalData);
      const decrypted = decryptMedicalToken(token, PATIENT_WALLET);

      expect(decrypted).toEqual(sampleMedicalData);
    });

    it('should fail to decrypt with wrong patient wallet', () => {
      const token = generateMedicalToken(sampleMedicalData);

      expect(() => {
        decryptMedicalToken(token, WRONG_WALLET);
      }).toThrow();
    });

    it('should handle wallet address case insensitivity', () => {
      const token = generateMedicalToken(sampleMedicalData);
      
      // Test with uppercase wallet
      const decryptedUpper = decryptMedicalToken(token, PATIENT_WALLET.toUpperCase());
      expect(decryptedUpper).toEqual(sampleMedicalData);
      
      // Test with lowercase wallet
      const decryptedLower = decryptMedicalToken(token, PATIENT_WALLET.toLowerCase());
      expect(decryptedLower).toEqual(sampleMedicalData);
    });

    it('should preserve all medical data fields', () => {
      const token = generateMedicalToken(sampleMedicalData);
      const decrypted = decryptMedicalToken(token, PATIENT_WALLET);

      expect(decrypted.patientName).toBe(sampleMedicalData.patientName);
      expect(decrypted.patientWallet).toBe(sampleMedicalData.patientWallet);
      expect(decrypted.testType).toBe(sampleMedicalData.testType);
      expect(decrypted.results).toEqual(sampleMedicalData.results);
      expect(decrypted.date).toBe(sampleMedicalData.date);
      expect(decrypted.notes).toBe(sampleMedicalData.notes);
    });
  });

  describe('Token Serialization', () => {
    it('should serialize and deserialize token correctly', () => {
      const token = generateMedicalToken(sampleMedicalData);
      const serialized = serializeToken(token);
      const deserialized = deserializeToken(serialized);

      expect(deserialized).toEqual(token);
      expect(isValidToken(deserialized)).toBe(true);
    });

    it('should handle serialization to/from Arkiv format', () => {
      const token = generateMedicalToken(sampleMedicalData);
      const serialized = serializeToken(token);

      // Simulate saving to Arkiv and retrieving
      const retrieved = deserializeToken(serialized);
      const decrypted = decryptMedicalToken(retrieved, PATIENT_WALLET);

      expect(decrypted).toEqual(sampleMedicalData);
    });
  });

  describe('Token Validation', () => {
    it('should validate correct token structure', () => {
      const token = generateMedicalToken(sampleMedicalData);
      expect(isValidToken(token)).toBe(true);
    });

    it('should reject invalid token structures', () => {
      expect(isValidToken(null)).toBe(false);
      expect(isValidToken(undefined)).toBe(false);
      expect(isValidToken({})).toBe(false);
      expect(isValidToken({ version: '1.0.0' })).toBe(false);
      expect(isValidToken({ encrypted: 'abc', iv: 'def' })).toBe(false);
    });
  });

  describe('End-to-End Encryption Flow', () => {
    it('should complete full doctor-to-patient flow', () => {
      // STEP 1: Doctor creates encrypted token
      const doctorData: MedicalData = {
        patientName: 'Alice Johnson',
        patientWallet: PATIENT_WALLET,
        testType: 'CT Scan',
        results: {
          finding: 'No abnormalities detected',
          radiologist: 'Dr. Smith'
        },
        date: '2025-11-16',
        notes: 'Follow-up in 6 months'
      };

      const token = generateMedicalToken(doctorData);
      
      // STEP 2: Serialize for Arkiv storage
      const arkivPayload = serializeToken(token);
      expect(typeof arkivPayload).toBe('string');

      // STEP 3: Simulate retrieval from Arkiv
      const retrievedToken = deserializeToken(arkivPayload);
      
      // STEP 4: Patient decrypts with their wallet
      const decryptedData = decryptMedicalToken(retrievedToken, PATIENT_WALLET);
      
      // STEP 5: Verify data integrity
      expect(decryptedData).toEqual(doctorData);
    });

    it('should enforce privacy - unauthorized wallet cannot decrypt', () => {
      // Doctor creates token for specific patient
      const token = generateMedicalToken(sampleMedicalData);
      const arkivPayload = serializeToken(token);

      // Unauthorized user tries to decrypt
      const retrievedToken = deserializeToken(arkivPayload);
      
      expect(() => {
        decryptMedicalToken(retrievedToken, WRONG_WALLET);
      }).toThrow();
    });
  });

  describe('Key Derivation Security', () => {
    it('should derive consistent keys from same wallet', () => {
      const token1 = generateMedicalToken(sampleMedicalData);
      const token2 = generateMedicalToken(sampleMedicalData);

      // Both tokens should be decryptable with same wallet
      const decrypted1 = decryptMedicalToken(token1, PATIENT_WALLET);
      const decrypted2 = decryptMedicalToken(token2, PATIENT_WALLET);

      expect(decrypted1).toEqual(sampleMedicalData);
      expect(decrypted2).toEqual(sampleMedicalData);
    });

    it('should derive different keys for different wallets', () => {
      const data1: MedicalData = { ...sampleMedicalData, patientWallet: PATIENT_WALLET };
      const data2: MedicalData = { ...sampleMedicalData, patientWallet: WRONG_WALLET };

      const token1 = generateMedicalToken(data1);
      const token2 = generateMedicalToken(data2);

      // Token1 should only decrypt with PATIENT_WALLET
      const decrypted1 = decryptMedicalToken(token1, PATIENT_WALLET);
      expect(decrypted1.patientWallet).toBe(PATIENT_WALLET);

      // Token2 should only decrypt with WRONG_WALLET
      const decrypted2 = decryptMedicalToken(token2, WRONG_WALLET);
      expect(decrypted2.patientWallet).toBe(WRONG_WALLET);

      // Cross-decryption should fail
      expect(() => decryptMedicalToken(token1, WRONG_WALLET)).toThrow();
      expect(() => decryptMedicalToken(token2, PATIENT_WALLET)).toThrow();
    });
  });
});
