/**
 * Test de Debugging - Comparación de Wallets
 * 
 * Este test ayuda a identificar problemas de formato de wallet
 */

import { describe, it, expect } from 'vitest';
import {
  generateMedicalToken,
  decryptMedicalToken,
  serializeToken,
  deserializeToken,
  type MedicalData
} from '../services/medicalTokenService';

describe('Wallet Comparison Debugging', () => {
  
  it('should test all possible wallet format variations', () => {
    const variations = [
      '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821',  // Mixed case (MetaMask format)
      '0x7d70253e702954ef9ac2c0d74f9be35f15524821',  // All lowercase
      '0x7D70253E702954EF9AC2C0D74F9BE35F15524821',  // All uppercase
      '0X7d70253e702954Ef9Ac2c0D74F9BE35F15524821',  // 0X prefix
      '7d70253e702954Ef9Ac2c0D74F9BE35F15524821',    // No prefix
    ];
    
    console.log('🔍 Testing wallet format variations\n');
    
    // Create token with first variation
    const baseWallet = variations[0];
    const medicalData: MedicalData = {
      patientName: 'Test Patient',
      patientWallet: baseWallet,
      testType: 'Test',
      results: { value: '123' },
      date: '2025-11-16'
    };
    
    const token = generateMedicalToken(medicalData);
    console.log('Token created with wallet:', baseWallet);
    console.log('');
    
    // Try to decrypt with each variation
    variations.forEach((variation, index) => {
      console.log(`Attempt ${index + 1}: "${variation}"`);
      
      try {
        const decrypted = decryptMedicalToken(token, variation);
        console.log(`  ✅ SUCCESS - Decrypted with variation ${index + 1}`);
        expect(decrypted.patientName).toBe('Test Patient');
      } catch (error) {
        console.log(`  ❌ FAILED - Could not decrypt with variation ${index + 1}`);
        console.log(`     Error: ${error}`);
        throw error;
      }
    });
    
    console.log('\n✅ All variations work!');
  });

  it('should compare wallet formats byte by byte', () => {
    const wallet1 = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    const wallet2 = '0x7d70253e702954ef9ac2c0d74f9be35f15524821';
    
    console.log('\n🔬 Byte-by-byte wallet comparison\n');
    console.log('Wallet 1:', wallet1);
    console.log('Wallet 2:', wallet2);
    console.log('');
    
    // Compare as strings
    console.log('String comparison (===):', wallet1 === wallet2);
    console.log('Lowercase comparison:', wallet1.toLowerCase() === wallet2.toLowerCase());
    console.log('');
    
    // Compare normalized (how our deriveKeyFromWallet works)
    const norm1 = wallet1.toLowerCase().replace('0x', '');
    const norm2 = wallet2.toLowerCase().replace('0x', '');
    
    console.log('Normalized 1:', norm1);
    console.log('Normalized 2:', norm2);
    console.log('Normalized match:', norm1 === norm2);
    console.log('');
    
    // Create keys
    const repeated1 = norm1.repeat(Math.ceil(64 / norm1.length)).substring(0, 64);
    const repeated2 = norm2.repeat(Math.ceil(64 / norm2.length)).substring(0, 64);
    
    console.log('Key 1:', repeated1);
    console.log('Key 2:', repeated2);
    console.log('Keys match:', repeated1 === repeated2);
    console.log('');
    
    expect(repeated1).toBe(repeated2);
  });

  it('should test the exact scenario from backend logs', () => {
    // From your backend logs, this is the wallet being saved
    const BACKEND_WALLET = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    
    // This is what MetaMask might return (often lowercase)
    const METAMASK_WALLET = '0x7d70253e702954ef9ac2c0d74f9be35f15524821';
    
    console.log('\n🔍 Testing exact backend scenario\n');
    console.log('Backend saved with:', BACKEND_WALLET);
    console.log('MetaMask returns:', METAMASK_WALLET);
    console.log('');
    
    // Doctor creates with backend format
    const medicalData: MedicalData = {
      patientName: 'Real Patient',
      patientWallet: BACKEND_WALLET,
      testType: 'Blood Test',
      results: {
        hemoglobin: '14.5 g/dL'
      },
      date: '2025-11-16',
      notes: 'Test results'
    };
    
    console.log('📋 Doctor creates token...');
    const token = generateMedicalToken(medicalData);
    const serialized = serializeToken(token);
    console.log('   Token size:', serialized.length, 'bytes');
    console.log('');
    
    console.log('💾 Saved to Arkiv');
    console.log('');
    
    console.log('🔍 Patient queries Arkiv...');
    const retrieved = deserializeToken(serialized);
    console.log('   Retrieved successfully');
    console.log('');
    
    console.log('🔓 Patient attempts decrypt with MetaMask wallet...');
    console.log('   MetaMask wallet:', METAMASK_WALLET);
    
    try {
      const decrypted = decryptMedicalToken(retrieved, METAMASK_WALLET);
      console.log('   ✅ DECRYPTION SUCCESS!');
      console.log('');
      console.log('   Decrypted data:');
      console.log('   - Patient:', decrypted.patientName);
      console.log('   - Test:', decrypted.testType);
      console.log('   - Results:', JSON.stringify(decrypted.results));
      
      expect(decrypted.patientName).toBe('Real Patient');
    } catch (error) {
      console.error('   ❌ DECRYPTION FAILED!');
      console.error('   Error:', error);
      throw new Error('This should have worked but failed!');
    }
  });

  it('should test with checksum vs non-checksum addresses', () => {
    // Checksum address (mixed case - EIP-55)
    const checksumWallet = '0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821';
    
    // Non-checksum (all lowercase)
    const nonChecksumWallet = '0x7d70253e702954ef9ac2c0d74f9be35f15524821';
    
    console.log('\n🔍 Testing checksum vs non-checksum\n');
    console.log('Checksum (EIP-55):', checksumWallet);
    console.log('Non-checksum:', nonChecksumWallet);
    console.log('');
    
    // Create with checksum
    console.log('📋 Creating token with CHECKSUM address...');
    const data1: MedicalData = {
      patientName: 'Checksum Patient',
      patientWallet: checksumWallet,
      testType: 'Test',
      results: {},
      date: '2025-11-16'
    };
    const token1 = generateMedicalToken(data1);
    
    // Decrypt with non-checksum - should work
    console.log('🔓 Decrypting with NON-CHECKSUM address...');
    const decrypted1 = decryptMedicalToken(token1, nonChecksumWallet);
    console.log('   ✅ Works!');
    console.log('');
    
    // Create with non-checksum
    console.log('📋 Creating token with NON-CHECKSUM address...');
    const data2: MedicalData = {
      patientName: 'Non-Checksum Patient',
      patientWallet: nonChecksumWallet,
      testType: 'Test',
      results: {},
      date: '2025-11-16'
    };
    const token2 = generateMedicalToken(data2);
    
    // Decrypt with checksum - should work
    console.log('🔓 Decrypting with CHECKSUM address...');
    const decrypted2 = decryptMedicalToken(token2, checksumWallet);
    console.log('   ✅ Works!');
    console.log('');
    
    expect(decrypted1.patientName).toBe('Checksum Patient');
    expect(decrypted2.patientName).toBe('Non-Checksum Patient');
    
    console.log('✅ Checksum and non-checksum are interchangeable!');
  });

  it('should test actual data from your Arkiv results', () => {
    // These are from your actual Arkiv results in the screenshot
    const ENTITY_KEYS = [
      '0x2795660c6694762cb7...',
      '0x932bc92de7dde8b1b9...',
      '0x163635d0237b6ef02b...'
    ];
    
    const YOUR_WALLET = '0x7d70253e702954ef9ac2c0d74f9be35f15524821';
    
    console.log('\n📊 Analyzing your actual Arkiv results\n');
    console.log('Your connected wallet:', YOUR_WALLET);
    console.log('Entity keys in Arkiv:', ENTITY_KEYS.length);
    console.log('');
    
    console.log('❓ QUESTION: Were these entities created with YOUR wallet?');
    console.log('');
    console.log('To verify, check the backend logs when you created them.');
    console.log('Look for lines like:');
    console.log('  "Saving to Arkiv: { patient: \'0x...\', doctor: \'dr_smith_001\' }"');
    console.log('');
    console.log('The patient address in the logs MUST match:', YOUR_WALLET);
    console.log('');
    
    // Simulate what SHOULD happen
    console.log('✅ CORRECT scenario:');
    console.log('  1. Doctor enters Patient Wallet: ' + YOUR_WALLET);
    console.log('  2. Backend logs: "Saving to Arkiv: { patient: \'' + YOUR_WALLET + '\', ... }"');
    console.log('  3. Token encrypted with ' + YOUR_WALLET);
    console.log('  4. Patient connects with ' + YOUR_WALLET);
    console.log('  5. ✅ Decryption works!');
    console.log('');
    
    console.log('❌ WRONG scenario (what might be happening):');
    console.log('  1. Doctor enters Patient Wallet: 0xDIFFERENT_WALLET');
    console.log('  2. Backend logs: "Saving to Arkiv: { patient: \'0xDIFFERENT_WALLET\', ... }"');
    console.log('  3. Token encrypted with 0xDIFFERENT_WALLET');
    console.log('  4. Patient connects with ' + YOUR_WALLET);
    console.log('  5. ❌ Decryption fails! (different wallet)');
  });
});
