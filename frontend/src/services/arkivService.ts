/**
 * Arkiv Service - Integration with Arkiv Data Layer via Backend API
 */

// Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface MedicalResultMetadata {
  doctorId: string;
  patientWallet: string;
  timestamp: number;
}

export interface ArkivReceipt {
  entityKey: string;
  transactionHash: string;
}

export interface MedicalResult {
  entityKey: string;
  encryptedToken: string;
  doctor: string;
  timestamp: number;
}

export async function saveMedicalResult(
  encryptedToken: string,
  metadata: MedicalResultMetadata,
  expiresInDays: number = 30
): Promise<ArkivReceipt> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/medical-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encryptedToken,
        doctorId: metadata.doctorId,
        patientWallet: metadata.patientWallet,
        timestamp: metadata.timestamp,
        expiresInDays
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save to Arkiv');
    }

    const result = await response.json();
    return {
      entityKey: result.entityKey,
      transactionHash: result.transactionHash
    };
  } catch (error) {
    throw new Error(`Failed to save to Arkiv: ${error}`);
  }
}

export async function getPatientResults(patientWallet: string): Promise<MedicalResult[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/medical-results/${patientWallet.toLowerCase()}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to query Arkiv');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    throw new Error(`Failed to query Arkiv: ${error}`);
  }
}
