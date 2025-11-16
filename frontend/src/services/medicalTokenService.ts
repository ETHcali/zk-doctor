/**
 * Medical Token Service - Simplificado para zk-doctor
 * 
 * Este servicio maneja la generación y descifrado de tokens médicos
 * usando criptografía simétrica (AES-256-CBC) para el MVP
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Medical Data Interface
 */
export interface MedicalData {
  patientName: string;
  patientWallet: string;
  testType: string;
  results: Record<string, any>;
  date: string;
  notes?: string;
}

/**
 * Encrypted Token Structure
 */
export interface EncryptedMedicalToken {
  version: string;
  encrypted: string;
  iv: string;
  authTag?: string;
  timestamp: number;
}

/**
 * Genera una clave de cifrado desde una wallet address
 * Esta es una simplificación para el MVP. En producción usar key derivation
 * 
 * @param walletAddress - Dirección de la wallet del paciente
 * @returns Buffer de 32 bytes para AES-256
 */
function deriveKeyFromWallet(walletAddress: string): Buffer {
  // Normalizar y crear hash de 32 bytes
  const normalized = walletAddress.toLowerCase().replace('0x', '');
  const repeated = normalized.repeat(Math.ceil(64 / normalized.length)).substring(0, 64);
  return Buffer.from(repeated, 'hex');
}

/**
 * Genera un token médico cifrado
 * 
 * @param medicalData - Datos médicos a cifrar
 * @returns Token cifrado con IV
 */
export function generateMedicalToken(medicalData: MedicalData): EncryptedMedicalToken {
  try {
    // Derivar clave desde wallet del paciente
    const key = deriveKeyFromWallet(medicalData.patientWallet);
    
    // Generar IV aleatorio
    const iv = randomBytes(16);
    
    // Convertir datos médicos a JSON
    const dataString = JSON.stringify(medicalData);
    
    // Cifrar con AES-256-CBC
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(dataString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    console.log('🔐 Token médico generado:', {
      patient: medicalData.patientName,
      wallet: medicalData.patientWallet,
      dataSize: dataString.length
    });
    
    return {
      version: '1.0.0',
      encrypted,
      iv: iv.toString('hex'),
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error('❌ Error generando token médico:', error);
    throw new Error(`Failed to generate medical token: ${error}`);
  }
}

/**
 * Descifra un token médico
 * 
 * @param token - Token cifrado
 * @param patientWallet - Wallet del paciente para derivar la clave
 * @returns Datos médicos descifrados
 */
export function decryptMedicalToken(
  token: EncryptedMedicalToken,
  patientWallet: string
): MedicalData {
  try {
    // Derivar clave desde wallet del paciente
    const key = deriveKeyFromWallet(patientWallet);
    
    // Convertir IV de hex a Buffer
    const iv = Buffer.from(token.iv, 'hex');
    
    // Descifrar con AES-256-CBC
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(token.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Parsear JSON
    const medicalData: MedicalData = JSON.parse(decrypted);
    
    console.log('🔓 Token médico descifrado:', {
      patient: medicalData.patientName,
      testType: medicalData.testType
    });
    
    return medicalData;
    
  } catch (error) {
    console.error('❌ Error descifrando token médico:', error);
    throw new Error(`Failed to decrypt medical token: ${error}`);
  }
}

/**
 * Serializa un token cifrado a string JSON
 * Útil para guardar en Arkiv
 */
export function serializeToken(token: EncryptedMedicalToken): string {
  return JSON.stringify(token);
}

/**
 * Deserializa un token desde string JSON
 */
export function deserializeToken(tokenString: string): EncryptedMedicalToken {
  return JSON.parse(tokenString);
}

/**
 * Valida que un token tenga la estructura correcta
 */
export function isValidToken(token: any): token is EncryptedMedicalToken {
  return (
    typeof token === 'object' &&
    typeof token.version === 'string' &&
    typeof token.encrypted === 'string' &&
    typeof token.iv === 'string' &&
    typeof token.timestamp === 'number'
  );
}
