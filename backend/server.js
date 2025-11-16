import express from 'express';
import cors from 'cors';
import { createPublicClient, createWalletClient, http } from '@arkiv-network/sdk';
import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { mendoza } from '@arkiv-network/sdk/chains';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import { eq } from '@arkiv-network/sdk/query';

const app = express();
app.use(cors());
app.use(express.json());

const DEMO_DOCTOR_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// Create clients
const publicClient = createPublicClient({
  chain: mendoza,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: mendoza,
  transport: http(),
  account: privateKeyToAccount(DEMO_DOCTOR_PRIVATE_KEY),
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'zk-doctor-backend' });
});

// Save medical result
app.post('/api/medical-result', async (req, res) => {
  try {
    const { encryptedToken, doctorId, patientWallet, timestamp, expiresInDays = 30 } = req.body;

    if (!encryptedToken || !patientWallet) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payload = jsonToPayload({
      encryptedData: encryptedToken,
      metadata: {
        doctor: doctorId,
        patient: patientWallet.toLowerCase(),
        timestamp: timestamp,
        type: 'medical_result'
      }
    });

    const expirationTime = ExpirationTime.fromDays(expiresInDays);

    console.log('Saving to Arkiv:', {
      patient: patientWallet,
      doctor: doctorId,
      expiresIn: `${expiresInDays} days`
    });

    const result = await walletClient.createEntity({
      payload,
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: 'medical_result' },
        { key: 'doctor', value: doctorId },
        { key: 'patient', value: patientWallet.toLowerCase() },
        { key: 'timestamp', value: timestamp.toString() }
      ],
      expiresIn: expirationTime,
    });

    console.log('Saved to Arkiv:', result.entityKey);

    res.json({
      entityKey: result.entityKey,
      transactionHash: result.txHash || 'N/A'
    });

  } catch (error) {
    console.error('Error saving to Arkiv:', error);
    res.status(500).json({
      error: 'Failed to save to Arkiv',
      message: error.message
    });
  }
});

// Get patient results
app.get('/api/medical-results/:patientWallet', async (req, res) => {
  try {
    const { patientWallet } = req.params;

    console.log('Querying Arkiv for patient:', patientWallet);

    const query = publicClient.buildQuery();
    const result = await query
      .where(eq('type', 'medical_result'))
      .where(eq('patient', patientWallet.toLowerCase()))
      .withAttributes(true)
      .withPayload(true)
      .limit(100)
      .fetch();

    const results = result.entities.map(entity => ({
      entityKey: entity.key,
      encryptedToken: entity.payload.encryptedData,
      doctor: entity.attributes.find(a => a.key === 'doctor')?.value || 'unknown',
      timestamp: parseInt(entity.attributes.find(a => a.key === 'timestamp')?.value || '0')
    }));

    console.log(`Found ${results.length} results`);

    res.json({ results });

  } catch (error) {
    console.error('Error querying Arkiv:', error);
    res.status(500).json({
      error: 'Failed to query Arkiv',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  POST http://localhost:${PORT}/api/medical-result`);
  console.log(`  GET  http://localhost:${PORT}/api/medical-results/:wallet`);
});
