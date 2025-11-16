# 🏥 ZK-DOCTOR - Plan de Migración para Hackathon Arkiv

**Fecha**: 16 de noviembre de 2025  
**Hackathon**: Sub0 Polkadot Arkiv Track  
**Deadline**: TBD  
**Proyecto Base**: ZKPJWT (Arbitrum)  
**Proyecto Objetivo**: zk-doctor (Arkiv + Polkadot)

---

## 🎯 Objetivo

Transformar el proyecto **ZKPJWT** (token cifrado con Merkle trees para Arbitrum) en **zk-doctor**: un sistema de resultados médicos cifrados que demuestra el uso de **Arkiv** (data layer de Polkadot) con zero-knowledge tokens.

---

## 📊 Análisis del Proyecto Actual

### ✅ Componentes Reutilizables:

1. **Library (`/library`)**: 
   - ✅ Funciones de cifrado AES-256-CBC
   - ✅ Merkle Tree generation
   - ✅ Token structure (ZKPJWTToken interface)
   - 🔄 **Simplificar a**: `generateToken()` + `decryptToken()`

2. **Demo (`/demo`)**: 
   - ✅ Estructura React + TypeScript + Vite
   - ✅ Panel architecture (Sender/Receiver)
   - ✅ Wallet integration (ethers.js)
   - 🔄 **Transformar**: Doctor/Patient panels

3. **Documentación**:
   - ✅ README structure
   - ✅ Testing guides
   - 🔄 **Adaptar**: Para caso médico + Arkiv

### ❌ Componentes a Remover/Reemplazar:

1. **Contratos Solidity** (`/contracts`): No necesarios para Arkiv
2. **Stylus Rust** (`/zkpjwt-stylus`): Específico de Arbitrum
3. **Circom circuits** (`/circuits`): Opcional para MVP
4. **Blockchain deployment docs**: Cambiar por Arkiv docs

---

## 🏗️ Arquitectura zk-doctor

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
├──────────────────────┬──────────────────────────────────┤
│   Doctor Panel       │      Patient Panel               │
│  - Mock login        │   - Wallet connection            │
│  - Medical form      │   - Query Arkiv                  │
│  - Generate token    │   - Decrypt results              │
└──────────────────────┴──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              SERVICES LAYER (TypeScript)                 │
├──────────────────────┬──────────────────────────────────┤
│  zkpjwt-mvp          │      arkivService.ts             │
│  - generateToken()   │   - createClient()               │
│  - decryptToken()    │   - createROClient()             │
│                      │   - createEntities()             │
│                      │   - queryEntities()              │
└──────────────────────┴──────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  ARKIV DATA LAYER                        │
│  Entity: MedicalResult                                   │
│  - data: encrypted token                                 │
│  - annotations:                                          │
│    * type: "medical_result"                              │
│    * doctor: "doctor_simulated"                          │
│    * patient: <wallet_address>                           │
│  - expiresIn: "7d" (optional)                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Usuario

### 📋 Flujo Doctor:

1. ✅ Doctor accede (mock login, sin wallet)
2. ✅ Completa formulario médico:
   ```json
   {
     "patientName": "John Doe",
     "testType": "Blood Test",
     "results": {
       "glucose": "95 mg/dL",
       "cholesterol": "180 mg/dL"
     },
     "date": "2025-11-16",
     "notes": "Patient is healthy"
   }
   ```
3. ✅ Ingresa wallet del paciente
4. ✅ Sistema genera token cifrado con `zkpjwt-mvp.generateToken()`
5. ✅ Sistema guarda en Arkiv con `arkivService.saveMedicalResult()`
6. ✅ Confirmación + ID de entidad

### 🔓 Flujo Paciente:

1. ✅ Paciente conecta wallet
2. ✅ Sistema query Arkiv: `annotation.patient == wallet`
3. ✅ Muestra lista de resultados médicos
4. ✅ Paciente selecciona resultado
5. ✅ Sistema obtiene token de Arkiv
6. ✅ Descifra con `zkpjwt-mvp.decryptToken(privateKey)`
7. ✅ Muestra JSON médico en pantalla

---

## 📦 Dependencias Nuevas

```json
{
  "dependencies": {
    "@arkiv/client": "latest",
    "ethers": "^6.15.0",
    "react": "^19.2.0"
  }
}
```

---

## 🛠️ Tareas de Migración

### Fase 1: Setup (30min)
- [x] Crear este plan
- [ ] Instalar @arkiv/client
- [ ] Configurar Arkiv client (API key si es necesario)
- [ ] Limpiar código Arbitrum

### Fase 2: Library Refactor (1h)
- [ ] Simplificar `/library/src/index.ts`
- [ ] Mantener: `encryptMessage()`, `decryptMessage()`
- [ ] Crear wrappers:
  ```ts
  export function generateToken(medicalData: any, patientWallet: string)
  export function decryptToken(token: string, privateKey: string)
  ```
- [ ] Eliminar funciones Merkle (opcional para MVP)

### Fase 3: Arkiv Integration (1.5h)
- [ ] Crear `/demo/src/services/arkivService.ts`:
  ```ts
  export async function initArkivClient()
  export async function saveMedicalResult(token, metadata)
  export async function getPatientResults(wallet)
  ```
- [ ] Implementar CRUD con annotations
- [ ] Test básico de conexión

### Fase 4: Doctor Panel (1h)
- [ ] Renombrar `SenderPanel.tsx` → `DoctorPanel.tsx`
- [ ] Mock login (hardcoded "Dr. Smith")
- [ ] Formulario médico (4-5 campos)
- [ ] Botón "Generate Encrypted Result"
- [ ] Llamada a `generateToken()` + `saveMedicalResult()`

### Fase 5: Patient Panel (1h)
- [ ] Renombrar `ReceiverPanel.tsx` → `PatientPanel.tsx`
- [ ] Wallet connection (mantener ethers.js)
- [ ] Llamada a `getPatientResults(wallet)`
- [ ] Lista de resultados
- [ ] Botón "Decrypt" → `decryptToken()`
- [ ] Display JSON

### Fase 6: UI/UX (30min)
- [ ] Cambiar tema a médico (colores, iconos)
- [ ] Tabs: "Doctor" | "Patient"
- [ ] Loading states
- [ ] Error handling

### Fase 7: Documentación (1h)
- [ ] README.md actualizado
- [ ] ARKIV_INTEGRATION.md (Developer Experience)
- [ ] VIDEO_DEMO.md (guión)

### Fase 8: Deploy (30min)
- [ ] Deploy a Vercel
- [ ] Test en producción
- [ ] Grabar video demo (2-3min)

---

## 🎯 Criterios de Éxito

### Must Have ✅:
- [x] Arkiv SDK integrado correctamente
- [ ] Doctor puede crear resultado cifrado
- [ ] Resultado se guarda en Arkiv con annotations
- [ ] Paciente puede listar sus resultados
- [ ] Paciente puede descifrar solo sus resultados
- [ ] Demo funcional desplegado

### Nice to Have 🌟:
- [ ] TTL en Arkiv (expiresIn)
- [ ] UI pulida con Tailwind
- [ ] Multiple doctors
- [ ] Export to PDF

### Out of Scope ❌:
- ❌ Contratos inteligentes
- ❌ Merkle proofs on-chain
- ❌ Circom circuits
- ❌ Real authentication

---

## 📝 Notas de Desarrollo

### Cambios Clave vs ZKPJWT:

| Componente | ZKPJWT (Arbitrum) | zk-doctor (Arkiv) |
|------------|-------------------|-------------------|
| Storage | Smart Contract | Arkiv Entities |
| Auth | Merkle Tree on-chain | Annotations filter |
| Network | Arbitrum Sepolia | Arkiv (Polkadot) |
| Wallet | Required for both | Only for patient |
| Cost | Gas fees | Free (Arkiv) |

### Ventajas de Arkiv:

1. ✅ No gas fees
2. ✅ Built-in TTL
3. ✅ Queries con annotations
4. ✅ TypeScript-first
5. ✅ Polkadot ecosystem

---

## 🚀 Próximos Pasos

1. ✅ Revisar y aprobar este plan
2. ⏳ Iniciar Fase 1: Setup
3. ⏳ Implementar core functionality
4. ⏳ Testing + Deploy
5. ⏳ Submission

---

**Tiempo estimado total**: ~6-7 horas
**Estado actual**: Plan creado, listo para implementación
