# 🧪 GUÍA DE TESTING - zk-doctor

## 📋 Resumen

Este proyecto incluye:
1. **Tests unitarios** (`/frontend/src/__tests__/medicalTokenService.test.ts`)
2. **Tests E2E manuales** (via interfaz web)

## 🔬 Tests Unitarios

### Ejecutar Tests

```bash
cd frontend
npm test              # Modo watch (interactivo)
npm run test:run      # Una sola ejecución
npm run test:ui       # UI visual de Vitest
```

### Qué Testean

Los tests unitarios verifican:

✅ **Generación de tokens**
- Tokens válidos con estructura correcta
- IVs únicos y aleatorios
- Manejo de caracteres especiales

✅ **Encriptación/Desencriptación**
- Token se descifra correctamente con wallet autorizada
- Token NO se descifra con wallet incorrecta
- Case-insensitivity de wallets (0xABC = 0xabc)

✅ **Serialización**
- Conversión JSON correcta
- Compatibilidad con formato Arkiv

✅ **Flujo End-to-End**
- Doctor crea → Arkiv guarda → Paciente descifra
- Privacidad: wallets no autorizadas fallan

✅ **Seguridad de claves**
- Misma wallet genera claves consistentes
- Diferentes wallets generan claves diferentes

## 🌐 Tests E2E (Manual)

### Prerequisitos

1. Backend corriendo en `localhost:3001`
2. Frontend corriendo en `localhost:5173`
3. MetaMask instalado y configurado

### Test 1: Flujo Exitoso Doctor → Paciente

**Objetivo**: Verificar que un paciente puede descifrar su resultado médico

**Pasos**:

1. **Abrir MetaMask**
   - Conectar con una wallet específica
   - **COPIAR la dirección completa** (ej: `0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821`)

2. **Panel del Doctor** (http://localhost:5173)
   - Click en botón "Doctor"
   - Ingresar datos:
     ```
     Patient Name: Test Patient
     Patient Wallet: [PEGAR LA DIRECCIÓN DESDE METAMASK]
     Test Type: Blood Test
     Result Field: hemoglobin
     Result Value: 14.5 g/dL
     Notes: Test results
     ```
   - Click "Generate Encrypted Token"
   - ✅ Verificar mensaje: "SUCCESS: Medical result saved successfully to Arkiv!"
   - 📝 Anotar el Entity Key mostrado

3. **Panel del Paciente** (http://localhost:5173)
   - Click en botón "Patient"
   - Click "Connect Wallet"
   - Autorizar en MetaMask
   - ✅ Verificar que la wallet mostrada coincide con la del paso 1
   - Click "Refresh Results"
   - ✅ Verificar que aparece al menos 1 resultado
   - Click "Decrypt" en el resultado
   - ✅ **Resultado Esperado**: Se muestra la información médica desencriptada
     ```
     Patient Name: Test Patient
     Test Type: Blood Test
     Results:
       hemoglobin: 14.5 g/dL
     Notes: Test results
     ```

**Resultado Esperado**: ✅ SUCCESS - Desencriptación exitosa

---

### Test 2: Privacidad - Wallet Incorrecta

**Objetivo**: Verificar que otras wallets NO pueden descifrar

**Pasos**:

1. **Crear registro** (como en Test 1)
   - Usar wallet A: `0xABC123...`

2. **Cambiar de wallet en MetaMask**
   - Cambiar a wallet B: `0xDEF456...` (diferente)

3. **Panel del Paciente**
   - Conectar con wallet B
   - Click "Refresh Results"
   - ✅ El resultado del paso 1 debería aparecer (está en Arkiv)
   - Click "Decrypt"
   - ❌ **Resultado Esperado**: Error "Only the authorized patient can decrypt this result"

**Resultado Esperado**: ❌ ERROR - Wallet no autorizada no puede descifrar

---

### Test 3: Múltiples Resultados

**Objetivo**: Verificar que un paciente puede tener múltiples resultados

**Pasos**:

1. **Crear 3 registros diferentes** para la misma wallet
   - Registro 1: Blood Test
   - Registro 2: X-Ray
   - Registro 3: CT Scan

2. **Panel del Paciente**
   - Conectar con la wallet correcta
   - Click "Refresh Results"
   - ✅ Deberían aparecer 3 resultados
   - Click "Decrypt" en cada uno
   - ✅ Cada uno debería mostrar su información específica

**Resultado Esperado**: ✅ Todos los resultados se descifran correctamente

---

### Test 4: Verificación en Arkiv Explorer

**Objetivo**: Verificar que los datos están en Arkiv Mendoza testnet

**Pasos**:

1. Crear un registro médico
2. Copiar el Entity Key (ej: `0x2795660c6694762cb7...`)
3. Abrir Arkiv Explorer: https://mendoza.explorer.arkiv.network
4. Buscar el Entity Key
5. ✅ Verificar que existe en Arkiv
6. ✅ Verificar metadata (timestamp, doctor, patient)
7. ❌ **Los datos médicos deberían estar encriptados** (no legibles en Arkiv)

**Resultado Esperado**: ✅ Entity existe pero datos están encriptados

---

## 🐛 Troubleshooting

### Error: "Only the authorized patient can decrypt"

**Causa**: La wallet conectada NO es la misma que el doctor usó al crear el registro.

**Solución**:
1. Verifica qué wallet está conectada en MetaMask
2. Esa MISMA wallet debe ser la que el doctor ingresó en "Patient Wallet"
3. Crea un nuevo registro con la wallet correcta

### Error: "No medical results found"

**Causa**: No hay registros en Arkiv para esa wallet, O Arkiv Mendoza testnet está offline.

**Solución**:
1. Verifica logs del backend (`localhost:3001`)
2. Si ves errores de Arkiv, la testnet puede estar caída
3. Intenta crear un nuevo registro

### Error: "Failed to save to Arkiv"

**Causa**: Arkiv Mendoza testnet puede estar offline o tener problemas de red.

**Solución**:
1. Verifica los logs del backend
2. Busca errores de "fetch failed" o "TransactionExecutionError"
3. Espera unos minutos e intenta de nuevo
4. **Nota**: La encriptación funciona localmente, solo falla el guardado en Arkiv

### Frontend no carga

**Solución**:
```bash
cd frontend
npm install
npm run dev
```

### Backend no responde

**Solución**:
```bash
cd backend
npm install
node server.js
```

---

## 📊 Checklist de Testing

Antes de hacer deploy o submission:

- [ ] Tests unitarios pasan (npm run test:run)
- [ ] Test E2E 1: Flujo exitoso funciona
- [ ] Test E2E 2: Wallet incorrecta falla correctamente
- [ ] Test E2E 3: Múltiples resultados funcionan
- [ ] Test E2E 4: Verificación en Arkiv Explorer
- [ ] Backend logs no muestran errores críticos
- [ ] Frontend responsive en móvil
- [ ] Screenshots capturados para submission
- [ ] Video demo grabado (2-3 min)

---

## 🎯 Próximos Pasos

1. **Ejecutar tests unitarios**:
   ```bash
   cd frontend
   npm run test:run
   ```

2. **Ejecutar tests E2E manuales** siguiendo esta guía

3. **Documentar resultados** en TESTING_RESULTS.md

4. **Capturar screenshots** para submission

5. **Continuar con deployment** (Vercel + Railway/Render)
