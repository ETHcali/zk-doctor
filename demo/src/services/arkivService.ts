/**
 * Arkiv Service - Integration with Arkiv Data Layer (Mendoza Testnet)
 * 
 * This service handles all interactions with Arkiv:
 * - Creating encrypted medical results
 * - Querying results by patient wallet
 * - Managing entity lifecycle
 */

import { createPublicClient, createWalletClient, http } from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { mendoza } from '@arkiv-network/sdk/chains';
import { jsonToPayload, ExpirationTime } from '@arkiv-network/sdk/utils';
import { eq } from '@arkiv-network/sdk/query';

// Demo Doctor Private Key (Hardhat default account #0)
// ⚠️ In production, use environment variables!
const DEMO_DOCTOR_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

/**
 * Medical Result Metadata
 */
export interface MedicalResultMetadata {
  doctorId: string;
  patientWallet: string;
  timestamp: number;
}

/**
 * Arkiv Entity Receipt
 */
export interface ArkivReceipt {
  entityKey: string;
  transactionHash: string;
}

/**
 * Medical Result from Arkiv
 */
export interface MedicalResult {
  entityKey: string;
  encryptedToken: string;
  doctor: string;
  patient: string;
  timestamp: number;
}

/**
 * Get Arkiv public client for read operations
 */
export function getPublicClient() {
  return createPublicClient({
    chain: mendoza, // Mendoza is Arkiv's testnet for hackathons
    transport: http(),
  });
}

/**
 * Get Arkiv wallet client for write operations (Doctor)
 */
export function getWalletClient() {
  const account = privateKeyToAccount(DEMO_DOCTOR_PRIVATE_KEY as `0x${string}`);
  
  return createWalletClient({
    chain: mendoza,
    transport: http(),
    account,
  });
}

/**
 * Save encrypted medical result to Arkiv
 * 
 * @param encryptedToken - Encrypted ZK token containing medical data
 * @param metadata - Doctor ID, patient wallet, timestamp
 * @param expiresInDays - Optional TTL in days (default: 30 days)
 * @returns Receipt with entity key and transaction hash
 */
export async function saveMedicalResult(
  encryptedToken: string,
  metadata: MedicalResultMetadata,
  expiresInDays: number = 30
): Promise<ArkivReceipt> {
  try {
    const client = getWalletClient();
    
    // Prepare medical result payload
    const payload = jsonToPayload({
      encryptedData: encryptedToken,
      metadata: {
        doctor: metadata.doctorId,
        patient: metadata.patientWallet.toLowerCase(),
        timestamp: metadata.timestamp,
        type: 'medical_result'
      }
    });
    
    // Calculate expiration time
    const expirationTime = ExpirationTime.fromDays(expiresInDays);
    
    console.log('📤 Saving to Arkiv (Mendoza):', {
      patient: metadata.patientWallet,
      doctor: metadata.doctorId,
      expiresIn: `${expiresInDays} days`,
      dataSize: encryptedToken.length
    });
    
    // Create entity in Arkiv
    const result = await client.createEntity({
      payload,
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: 'medical_result' },
        { key: 'doctor', value: metadata.doctorId },
        { key: 'patient', value: metadata.patientWallet.toLowerCase() },
        { key: 'timestamp', value: metadata.timestamp.toString() }
      ],
      expiresIn: expirationTime,
    });
    
    console.log('✅ Saved to Arkiv:', result.entityKey);
    
    return {
      entityKey: result.entityKey,
      transactionHash: result.txHash || 'N/A'
    };
    
  } catch (error) {
    console.error('❌ Failed to save medical result to Arkiv:', error);
    throw new Error(`Failed to save to Arkiv: ${error}`);
  }
}

/**
 * Query medical results for a specific patient
 * 
 * @param patientWallet - Patient's wallet address
 * @returns Array of medical results
 */
export async function getPatientResults(patientWallet: string): Promise<MedicalResult[]> {
  try {
    const client = getPublicClient();
    
    console.log('🔍 Querying Arkiv for patient:', patientWallet);
    
    // Build query using QueryBuilder
    const query = client.buildQuery();
    const result = await query
      .where(eq('type', 'medical_result'))
      .where(eq('patient', patientWallet.toLowerCase()))
      .withAttributes(true)
      .withPayload(true)
      .limit(100)
      .fetch();
    
    console.log(`✅ Found ${result.entities.length} results for patient`);
    
    // Map entities to MedicalResult objects
    const medicalResults: MedicalResult[] = result.entities.map((entity: any) => {
      // Parse payload
      const payloadStr = new TextDecoder().decode(entity.payload);
      const payloadData = JSON.parse(payloadStr);
      
      // Extract attributes
      const doctorAttr = entity.attributes?.find((a: any) => a.key === 'doctor')?.value || 'Unknown';
      const patientAttr = entity.attributes?.find((a: any) => a.key === 'patient')?.value || '';
      const timestampAttr = entity.attributes?.find((a: any) => a.key === 'timestamp')?.value || '0';
      
      return {
        entityKey: entity.entityKey,
        encryptedToken: payloadData.encryptedData,
        doctor: doctorAttr,
        patient: patientAttr,
        timestamp: parseInt(timestampAttr)
      };
    });
    
    return medicalResults;
    
  } catch (error) {
    console.error('❌ Failed to query patient results:', error);
    throw new Error(`Failed to query Arkiv: ${error}`);
  }
}

/**
 * Get Arkiv network configuration
 */
export function getArkivConfig() {
  return {
    name: 'Mendoza Testnet',
    chainId: mendoza.id,
    rpcUrl: mendoza.rpcUrls.default.http[0],
    explorer: 'https://explorer.mendoza.arkiv.network/',
    faucet: 'https://faucet.mendoza.arkiv.network/'
  };
}

/**
 * Get entity by key
 */
export async function getEntityByKey(entityKey: string) {
  try {
    const client = getPublicClient();
    const entity = await client.getEntity(entityKey as `0x${string}`);
    return entity;
  } catch (error) {
    console.error('❌ Failed to get entity:', error);
    throw new Error(`Failed to get entity: ${error}`);
  }
}
