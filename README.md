# 🏥 zk-doctor

**Private Medical Results on Arkiv (Polkadot)**

> Zero-Knowledge encrypted healthcare data powered by Arkiv's data layer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Polkadot](https://img.shields.io/badge/Polkadot-Sub0-E6007A)](https://polkadot.network/)
[![Arkiv](https://img.shields.io/badge/Arkiv-Data%20Layer-blue)](https://arkiv.dev.golem.network/)

---

## 📋 Overview

**zk-doctor** is a privacy-first medical records system that demonstrates how sensitive healthcare data can be stored securely on **Arkiv** (Polkadot's queryable data layer) using zero-knowledge encryption.

### The Problem

Medical results contain highly sensitive information. Traditional solutions either:
- 🔴 Store data in centralized databases (single point of failure)
- 🔴 Use blockchain with high costs and no privacy
- 🔴 Lack queryability (IPFS)

### Our Solution

zk-doctor combines:
- 🔐 **Client-side AES-256-CBC encryption** - Data encrypted before leaving browser
- 🔑 **Wallet-based access control** - Only patient's wallet can decrypt
- 📦 **Arkiv storage** - Queryable, cost-effective, TTL-based
- ⚡ **No gas fees** - Polkadot ecosystem benefits

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **End-to-End Encryption** | Medical results encrypted client-side using AES-256-CBC |
| 🔑 **Wallet-Based Access** | Only the patient's wallet can decrypt their results |
| 📦 **Arkiv Storage** | Encrypted data stored on Arkiv with queryable annotations |
| ⏰ **TTL Support** | Automatic expiration after 30 days (configurable) |
| 👨‍⚕️ **Doctor Portal** | Simple interface for doctors to create encrypted results |
| 👤 **Patient Portal** | Secure access for patients to view and decrypt their data |
| 🌐 **No Gas Fees** | Leverage Polkadot's cost-effective infrastructure |
| 🔍 **Queryable** | Find results using Arkiv annotations (patient wallet filter) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Frontend (React + TypeScript + Vite)            │
├────────────────────┬────────────────────────────────────┤
│  👨‍⚕️ Doctor Panel   │  👤 Patient Panel                  │
│  • Mock login      │  • Wallet connection               │
│  • Medical form    │  • Query Arkiv                     │
│  • Generate token  │  • Decrypt results                 │
└────────────────────┴────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│          Services Layer (TypeScript)                     │
├───────────────────────┬─────────────────────────────────┤
│  medicalTokenService  │  arkivService                   │
│  • generateToken()    │  • saveMedicalResult()          │
│  • decryptToken()     │  • getPatientResults()          │
│  • AES-256-CBC        │  • Arkiv SDK integration        │
└───────────────────────┴─────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         Arkiv Data Layer (Polkadot Mendoza)             │
│  • Queryable entities with annotations                  │
│  • TTL-based automatic expiration                       │
│  • No permanent storage costs                           │
│  • Built on Ethereum/Polkadot infrastructure            │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+ (or Bun)
- **MetaMask** (or any Web3 wallet)
- **Arkiv Mendoza testnet** access

### Installation

```bash
# Clone repository
git clone https://github.com/ETHcali/zk-doctor.git
cd zk-doctor

# Install dependencies
cd demo
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173/** 🎉

---

## 📖 Usage Guide

### 👨‍⚕️ As a Doctor:

1. Navigate to **Doctor** tab
2. Fill in patient information:
   - **Patient Name**: John Doe
   - **Patient Wallet**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb...`
   - **Test Type**: Blood Test, X-Ray, MRI, etc.
   - **Results**: Key-value pairs (e.g., "Glucose" = "95 mg/dL")
   - **Clinical Notes**: Optional observations
3. Click **"Generate Encrypted Result"**
4. System encrypts data and saves to Arkiv
5. Share Entity Key with patient (optional)

### 👤 As a Patient:

1. Navigate to **Patient** tab
2. Click **"Connect Wallet"** (MetaMask)
3. System automatically queries Arkiv for your results
4. Click **"Descifrar"** (Decrypt) on any result
5. View your medical data securely

---

## 🔧 Technical Details

### Encryption Method

- **Algorithm**: AES-256-CBC
- **Key Derivation**: Wallet address → SHA-256 hash → 32-byte key
- **IV**: Random 16-byte initialization vector per token
- **Format**: JSON serialization

```typescript
interface EncryptedMedicalToken {
  version: string;
  encrypted: string;  // Hex-encoded ciphertext
  iv: string;         // Hex-encoded IV
  timestamp: number;
}
```

### Arkiv Integration

**Storage**:
```typescript
await saveMedicalResult(encryptedToken, {
  doctorId: 'dr_smith_001',
  patientWallet: '0x742d35Cc...',
  timestamp: Date.now()
}, 30); // 30 days TTL
```

**Query**:
```typescript
const results = await getPatientResults(patientWallet);
// Returns: MedicalResult[] filtered by annotation.patient
```

**Annotations Used**:
- `type`: 'medical_result'
- `doctor`: Doctor ID
- `patient`: Patient wallet address (lowercase)
- `timestamp`: Creation timestamp

---

## 📁 Project Structure

```
zk-doctor/
├── demo/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── DoctorPanel.tsx   # Doctor interface
│   │   │   └── PatientPanel.tsx  # Patient interface
│   │   ├── services/
│   │   │   ├── arkivService.ts          # Arkiv integration
│   │   │   └── medicalTokenService.ts   # Encryption
│   │   ├── App.tsx               # Main app
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── library/                      # Crypto utilities (optional)
├── archive/                      # Legacy ZKPJWT files
├── BACKLOG.md                    # Development tasks
├── ZK_DOCTOR_PLAN.md             # Migration plan
└── README.md                     # This file
```

---

## 🌐 Arkiv Network Details

| Property | Value |
|----------|-------|
| **Testnet** | Mendoza |
| **SDK Version** | @arkiv-network/sdk v0.4.5+ |
| **Faucet** | https://faucet.mendoza.arkiv.network/ |
| **Explorer** | https://explorer.mendoza.arkiv.network/ |
| **Docs** | https://arkiv.dev.golem.network/docs |

---

## 🎥 Demo Video

[📺 Watch 2-minute demo](https://youtu.be/TBD)  
*(Coming soon after deployment)*

---

## 🔒 Security Considerations

### ⚠️ MVP Simplifications (For Hackathon Demo):

- Doctor authentication is mocked (no real auth)
- Private key in code (use environment variables in production)
- Key derivation is simplified (use proper KDF like PBKDF2/Argon2)
- No rate limiting or abuse prevention

### 🛡️ Production Recommendations:

- [ ] Implement proper doctor authentication (OAuth, SAML, etc.)
- [ ] Use hardware security modules (HSM) for key management
- [ ] Add RBAC (Role-Based Access Control)
- [ ] Implement audit logging
- [ ] Add signature verification for data integrity
- [ ] Use proper key derivation functions
- [ ] Add encryption at rest for Arkiv keys
- [ ] Implement rate limiting and DDoS protection

---

## 🧪 Testing

```bash
# Build production bundle
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Manual Testing:

See **[BACKLOG.md](./BACKLOG.md)** → Ticket ZKD-301 for comprehensive E2E testing guide.

---

## 🏆 Hackathon Submission

**Track**: Arkiv - Build with Arkiv's Data Layer  
**Event**: Sub0 Polkadot Hackathon 2025  
**Team**: ETHcali

### Arkiv SDK Features Demonstrated:

✅ **createWalletClient** - Write operations (doctor creates entities)  
✅ **createPublicClient** - Read operations (patient queries)  
✅ **createEntity** - Store encrypted medical data  
✅ **buildQuery** - Query by annotations (patient filter)  
✅ **Annotations** - Metadata for queryability  
✅ **ExpirationTime** - TTL support (30 days)  
✅ **Attributes** - Key-value pairs for filtering

---

## 🤝 Contributing

This is a hackathon MVP. For production use, please consider:

1. Fork the repository
2. Implement security enhancements (see above)
3. Add comprehensive tests
4. Submit PR with improvements

---

## 📜 License

MIT License - See [LICENSE](./LICENSE) file

---

## 👥 Team

- **Developer**: Cristobal Valencia
- **GitHub**: [@ETHcali](https://github.com/ETHcali)
- **Project**: [github.com/ETHcali/zk-doctor](https://github.com/ETHcali/zk-doctor)

---

## 🙏 Acknowledgments

- **Arkiv Team** - For the excellent data layer and comprehensive documentation
- **Polkadot** - For the Sub0 hackathon opportunity and ecosystem support
- **Golem Network** - For supporting Arkiv development

---

## 📚 Additional Resources

- [Arkiv Documentation](https://arkiv.dev.golem.network/docs)
- [Arkiv SDK (TypeScript)](https://github.com/Arkiv-Network/arkiv-sdk-js)
- [Sub0 Hackathon](https://hack.sub0.gg/)
- [Polkadot](https://polkadot.network/)
- [BACKLOG.md](./BACKLOG.md) - Development tasks and tickets
- [ZK_DOCTOR_PLAN.md](./ZK_DOCTOR_PLAN.md) - Migration strategy

---

## 🎯 Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Basic encryption/decryption
- [x] Arkiv integration
- [x] Doctor/Patient portals
- [x] Query by wallet

### Phase 2: Enhanced Security 🚧 (Future)
- [ ] Real doctor authentication
- [ ] Multi-factor authentication
- [ ] Audit logging
- [ ] Rate limiting

### Phase 3: Advanced Features 🔮 (Future)
- [ ] PDF export
- [ ] Multi-language support (i18n)
- [ ] Mobile app
- [ ] Integration with EHR systems

---

**Built with ❤️ for the Polkadot ecosystem and the future of private healthcare**

*"Your health data should be private, secure, and always under your control."*
