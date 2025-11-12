# 🔐 ZKPJWT - Zero-Knowledge Proof JSON Web Token Protocol

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built for Arbitrum](https://img.shields.io/badge/Built%20for-Arbitrum-blue)](https://arbitrum.io/)
[![ARG25](https://img.shields.io/badge/ARG25-Invisible%20Garden-purple)](https://github.com/invisible-garden/arg25-projects)
[![Status](https://img.shields.io/badge/Status-Deployed%20✅-brightgreen)](https://sepolia.arbiscan.io/address/0xf935f364f797AF2336FfDb3ee06431e1616B7c6C)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)

> **🎉 LIVE ON ARBITRUM SEPOLIA!**  
> Contract: [`0xf935f364f797AF2336FfDb3ee06431e1616B7c6C`](https://sepolia.arbiscan.io/address/0xf935f364f797AF2336FfDb3ee06431e1616B7c6C#code)

> Privacy-preserving access control using Zero-Knowledge Proofs and cryptographic tokens on Arbitrum.

## 🚀 Quick Links

- 🔗 [**Live Contract on Arbiscan**](https://sepolia.arbiscan.io/address/0xf935f364f797AF2336FfDb3ee06431e1616B7c6C#code)
- ✅ [**Sourcify Verification**](https://repo.sourcify.dev/421614/0xf935f364f797AF2336FfDb3ee06431e1616B7c6C/)
- 📊 [**Deployment Summary**](./DEPLOYMENT_SUMMARY.md)
- 🎫 [**Development Tasks**](./TASKS.md)

## 🎯 What is ZKPJWT?

**ZKPJWT** is a decentralized protocol for access control to encrypted data using **Zero-Knowledge Proofs** and Merkle trees. It allows you to prove you're authorized to access data without revealing your specific identity.

### Key Features

- 🔒 **Privacy-Preserving**: Prove membership without revealing identity
- 🌳 **Merkle Tree Proofs**: Efficient cryptographic verification
- 🔐 **AES-256-GCM Encryption**: Military-grade encryption
- ⛓️ **On-Chain Verification**: Decentralized proof verification
- 📦 **Easy Integration**: Simple NPM library

## 🏗️ Architecture

```
┌─────────────┐
│   Sender    │ → Create authorized group
│             │ → Encrypt message
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   Merkle Tree       │ → Build tree from wallets
│   [wallet1...]      │ → Get Merkle root (R)
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   ZKPJWT Token      │ → {encrypted, root, key}
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│  Receiver   │ → Generate Merkle proof
│             │ → Verify on-chain
│             │ → Decrypt if authorized
└─────────────┘
```

## 🚀 Quick Start

### Installation

```bash
npm install zkpjwt
```

### Basic Usage

```typescript
import { 
  createMerkleTree, 
  encryptMessage, 
  generateZKPJWT,
  verifyMembership,
  decryptMessage 
} from 'zkpjwt';

// 1. Sender: Create authorized group
const authorizedWallets = [
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  '0x1234567890123456789012345678901234567890'
];

const merkleTree = createMerkleTree(authorizedWallets);
const merkleRoot = merkleTree.getRoot().toString('hex');

// 2. Encrypt message
const { encrypted, key, iv } = encryptMessage("Secret message!");

// 3. Generate ZKPJWT token
const zkpjwt = generateZKPJWT({
  encrypted,
  merkleRoot,
  keyInfo: { key: key.toString('hex'), iv: iv.toString('hex') }
});

// 4. Receiver: Verify and decrypt
const isAuthorized = verifyMembership(receiverWallet, merkleTree);
if (isAuthorized) {
  const decrypted = decryptMessage(encrypted, key, iv);
  console.log('✅ Message:', decrypted);
}
```

## 📁 Project Structure

```
zkp-jwt-library/
├── library/           # NPM package (TypeScript)
│   ├── src/
│   │   ├── index.ts   # Core functions
│   │   └── examples.ts
│   └── package.json
│
├── circuits/          # Zero-Knowledge circuits (Circom)
│   └── merkleProof.circom
│
├── contracts/         # Smart contracts
│   └── ZKPJWTVerifier.sol  # Solidity verifier
│
├── demo/              # React demo app
│   └── src/
│       ├── components/
│       │   ├── SenderPanel.tsx
│       │   └── ReceiverPanel.tsx
│       └── App.tsx
│
└── README.md
```

## 🔧 Development

### Build Library

```bash
cd library
npm install
npm run build
```

### Run Demo

```bash
cd demo
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

**Requirements**:
- MetaMask installed
- Arbitrum Sepolia network configured
- Testnet ETH for gas fees

### Deploy Contract

**Already deployed!** Contract address: `0xf935f364f797AF2336FfDb3ee06431e1616B7c6C`

To interact with the deployed contract:
```javascript
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './demo/src/config';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

// Publish Merkle root
await contract.publishRoot(merkleRoot);

// Verify proof
const isValid = await contract.verifyProof(root, leaf, proof);
```

### Run Examples

```bash
cd library
npm run build
node dist/examples.js
```

## 🎮 Live Demo

Experience ZKPJWT in action:

1. **Connect MetaMask** to Arbitrum Sepolia
2. **Sender Panel**: Create encrypted message and authorized wallet list
3. **Receiver Panel**: Verify membership and decrypt

[🌐 Live Demo](https://zkpjwt-demo.netlify.app) (Coming soon)

## 📚 Use Cases

### 1. Private Group Messaging

Encrypted messages that only authorized group members can read.

```typescript
const groupMembers = ['0xAlice...', '0xBob...', '0xCarol...'];
const tree = createMerkleTree(groupMembers);
const { encrypted, key, iv } = encryptMessage("Group meeting at 3pm");
```

### 2. Token-Gated Content

Prove token ownership without revealing balance.

```typescript
// Only NFT holders can access
const nftHolders = await getNFTHolders(contractAddress);
const token = generateZKPJWT({ encrypted, merkleRoot, keyInfo });
```

### 3. Credential Verification

Prove qualifications without exposing data.

```typescript
// Prove you have a diploma without showing it
const graduates = ['0xGrad1...', '0xGrad2...'];
const proof = generateProof(myWallet, createMerkleTree(graduates));
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Blockchain** | Arbitrum Sepolia |
| **Smart Contracts** | Solidity / Rust (Stylus) |
| **ZK Circuits** | Circom + SnarkJS |
| **Library** | TypeScript + Node.js |
| **Frontend** | React + Vite + ethers.js |
| **Encryption** | AES-256-GCM |
| **Hashing** | Keccak256 |

## 🔬 Smart Contract

### ZKPJWTVerifier.sol

```solidity
function verifyProof(
    bytes32 root,
    bytes32 leaf,
    bytes32[] calldata proof
) public pure returns (bool)

function unlockAccess(
    bytes32 root,
    bytes32 leaf,
    bytes32[] calldata proof
) external returns (bool)
```

### Deployed Contracts

- **Arbitrum Sepolia**: `0x...` (Coming soon)

## 📊 Gas Optimization

| Operation | Gas Cost | Notes |
|-----------|----------|-------|
| Publish Root | ~45,000 | One-time per group |
| Verify Proof | ~25,000 per level | Scales with tree depth |
| Unlock Access | ~70,000 | Includes event emission |

**Stylus (Rust) Version**: Expected 10x reduction in gas costs.

## 🧪 Testing

```bash
# Unit tests
cd library
npm test

# Integration tests
cd contracts
npx hardhat test

# E2E tests
cd demo
npm run test:e2e
```

## 🚧 Roadmap

### Phase 1 (✅ MVP - ARG25)
- [x] TypeScript library with core functions
- [x] Circom circuit design
- [x] Solidity verifier contract
- [x] React demo application
- [x] Documentation

### Phase 2 (Q1 2026)
- [ ] Rust contract with Arbitrum Stylus
- [ ] Full ZK proof generation and verification
- [ ] NPM package publication
- [ ] Security audit

### Phase 3 (Q2 2026)
- [ ] Multi-chain support (Polygon zkEVM, zkSync)
- [ ] Mobile SDK (React Native)
- [ ] Recursive proofs for batch verification
- [ ] Decentralized key management

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/zkp-jwt.git

# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'Add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 👨‍💻 Author

**DevCristobalvc**

- GitHub: [@DevCristobalvc](https://github.com/DevCristobalvc)
- Devfolio: [@DevCristobalvc](https://devfolio.co/@DevCristobalvc)

## 🙏 Acknowledgments

- **Arbitrum ARG25 Program** for support and resources
- **Invisible Garden** for program coordination
- **Circom** and **SnarkJS** teams for ZK tools
- **MerkleTreeJS** library maintainers

## 📚 Resources

- [Arbitrum Stylus Documentation](https://docs.arbitrum.io/stylus)
- [Circom Documentation](https://docs.circom.io/)
- [JWT RFC 7519 Standard](https://datatracker.ietf.org/doc/html/rfc7519)
- [Zero-Knowledge Proofs: An Illustrated Primer](https://blog.cryptographyengineering.com/2014/11/27/zero-knowledge-proofs-illustrated-primer/)

---

<div align="center">

**Built with ❤️ for Arbitrum ARG25**

[Website](https://zkpjwt.dev) • [Documentation](https://docs.zkpjwt.dev) • [Discord](https://discord.gg/zkpjwt)

</div>
