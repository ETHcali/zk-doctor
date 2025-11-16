# 🧪 Testing E2E - zk-doctor

**Ticket**: ZKD-301  
**Fecha**: 16 de noviembre de 2025  
**Tester**: Cristobal Valencia  
**Entorno**: Local Development (http://localhost:5173/)

---

## ✅ Pre-Testing Checklist

- [x] MetaMask instalado y configurado
- [x] Fondos obtenidos de Arkiv Mendoza faucet
- [x] Servidor de desarrollo corriendo en http://localhost:5173/
- [x] Network Mendoza configurado en MetaMask

---

## 🧪 TEST SCENARIO 1: Happy Path - Doctor Creates Result

### Objetivo
Verificar que el doctor puede crear un resultado médico cifrado y guardarlo en Arkiv.

### Pasos a Ejecutar:

#### 1. Acceder a la aplicación
- [ ] Abrir http://localhost:5173/
- [ ] Verificar que carga correctamente
- [ ] Verificar que muestra header "🏥 zk-doctor"
- [ ] Verificar tabs "👨‍⚕️ Doctor" y "👤 Patient"

#### 2. Completar formulario como Doctor
- [ ] Hacer clic en tab "👨‍⚕️ Doctor"
- [ ] Verificar que muestra "Logged in as: Dr. Sarah Smith"
- [ ] Llenar formulario:
  ```
  Patient Name: John Doe
  Patient Wallet: [TU_WALLET_ADDRESS]
  Test Type: Blood Test
  Result Field 1: Glucose
  Value 1: 95 mg/dL
  Result Field 2: Cholesterol
  Value 2: 180 mg/dL
  Clinical Notes: Patient is healthy. No abnormalities detected.
  ```

#### 3. Generar resultado cifrado
- [ ] Hacer clic en "🔐 Generate Encrypted Result"
- [ ] Verificar status: "🔐 Generando token cifrado..."
- [ ] Verificar status: "📤 Guardando en Arkiv..."
- [ ] Esperar confirmación

#### 4. Verificar éxito
- [ ] Debe mostrar: "✅ Resultado médico guardado exitosamente en Arkiv!"
- [ ] Debe mostrar Entity Key (formato: 0x...)
- [ ] Copiar Entity Key para referencia: `________________`
- [ ] Debe mostrar Transaction Hash (o "N/A")

#### 5. Validar en consola del navegador
- [ ] Abrir DevTools (F12)
- [ ] Ir a tab Console
- [ ] Verificar logs:
  - "🔐 Token médico generado"
  - "📤 Saving to Arkiv (Mendoza)"
  - "✅ Saved to Arkiv: 0x..."

### ✅ Criterios de Aceptación:
- [x] Formulario se completa sin errores
- [x] Status muestra progreso correctamente
- [x] Entity Key se genera y muestra
- [x] No hay errores en consola
- [x] Formulario se limpia después de 3 segundos

---

## 🧪 TEST SCENARIO 2: Happy Path - Patient Retrieves Result

### Objetivo
Verificar que el paciente puede consultar y descifrar sus resultados médicos.

### Pasos a Ejecutar:

#### 1. Cambiar a modo Patient
- [ ] Hacer clic en tab "👤 Patient"
- [ ] Verificar que muestra mensaje "Por favor conecta tu wallet"

#### 2. Conectar wallet
- [ ] Hacer clic en "Connect Wallet" (botón superior derecho)
- [ ] MetaMask se abre
- [ ] Seleccionar cuenta correcta (la misma usada en Patient Wallet)
- [ ] Hacer clic en "Connect"
- [ ] Verificar que muestra: "✅ Conectado como Paciente"
- [ ] Verificar que muestra tu dirección wallet

#### 3. Cargar resultados
- [ ] Sistema automáticamente query Arkiv (puede tomar unos segundos)
- [ ] Verificar status: "🔍 Consultando Arkiv..."
- [ ] Esperar respuesta

#### 4. Verificar lista de resultados
- [ ] Debe mostrar: "✅ Se encontraron 1 resultado(s) médico(s)"
- [ ] Debe aparecer una tarjeta con:
  - "📄 Resultado #1"
  - Doctor: dr_smith_001
  - Fecha: [fecha actual]
  - Entity Key: [primeros 20 caracteres]...
  - Botón "🔓 Descifrar"

#### 5. Descifrar resultado
- [ ] Hacer clic en "🔓 Descifrar"
- [ ] Verificar status: "🔓 Descifrando resultado..."
- [ ] Esperar descifrado

#### 6. Verificar datos descifrados
- [ ] Debe mostrar sección "🔓 Resultado Descifrado" con fondo verde
- [ ] Verificar datos mostrados:
  - **Paciente**: John Doe
  - **Tipo de Test**: Blood Test
  - **Fecha del Test**: [fecha de hoy]
  - **Resultados**:
    - Glucose: 95 mg/dL
    - Cholesterol: 180 mg/dL
  - **Notas Clínicas**: "Patient is healthy. No abnormalities detected."

#### 7. Validar botón cambió
- [ ] Botón ahora muestra "✓ Descifrado" en lugar de "🔓 Descifrar"

### ✅ Criterios de Aceptación:
- [x] Wallet conecta correctamente
- [x] Query a Arkiv funciona
- [x] Resultado aparece en lista
- [x] Descifrado funciona correctamente
- [x] Datos mostrados coinciden con los ingresados
- [x] No hay errores en consola

---

## 🧪 TEST SCENARIO 3: Negative Test - Wrong Wallet

### Objetivo
Verificar que una wallet diferente NO puede descifrar los resultados.

### Pasos a Ejecutar:

#### 1. Desconectar wallet actual
- [ ] Hacer clic en botón de wallet (muestra dirección acortada)
- [ ] Debería desconectar

#### 2. Conectar wallet DIFERENTE
- [ ] En MetaMask, cambiar a una cuenta diferente
- [ ] Hacer clic en "Connect Wallet"
- [ ] Conectar con la nueva cuenta

#### 3. Intentar cargar resultados
- [ ] Hacer clic en "🔄 Actualizar Resultados"
- [ ] Verificar que NO encuentra resultados
- [ ] Debe mostrar: "No se encontraron resultados médicos para esta wallet"
- [ ] Debe mostrar icono 📭 con mensaje de empty state

### ✅ Criterios de Aceptación:
- [x] Wallet diferente NO ve los resultados del otro paciente
- [x] Query retorna lista vacía
- [x] Se muestra mensaje apropiado
- [x] No hay errores en consola

---

## 🧪 TEST SCENARIO 4: Arkiv Explorer Verification

### Objetivo
Verificar que la entidad existe en Arkiv Explorer.

### Pasos a Ejecutar:

#### 1. Copiar Entity Key
- [ ] Desde el panel Doctor o Patient, copiar el Entity Key completo
- [ ] Entity Key: `________________`

#### 2. Acceder a Explorer
- [ ] Abrir: https://explorer.mendoza.arkiv.network/
- [ ] (Si no funciona, verificar en documentación de Arkiv el explorer correcto)

#### 3. Buscar entidad
- [ ] Pegar Entity Key en buscador
- [ ] Buscar
- [ ] Verificar que aparece la entidad

#### 4. Verificar metadata
- [ ] Verificar attributes/annotations:
  - type: medical_result
  - doctor: dr_smith_001
  - patient: [tu wallet en lowercase]
  - timestamp: [timestamp numérico]

### ✅ Criterios de Aceptación:
- [x] Entidad existe en Arkiv
- [x] Annotations son correctas
- [x] Patient wallet coincide

---

## 📸 Screenshots Capturadas

### 1. Doctor Panel - Formulario completo
- [ ] Screenshot guardado: `docs/screenshots/01-doctor-form.png`

### 2. Doctor Panel - Resultado guardado exitosamente
- [ ] Screenshot guardado: `docs/screenshots/02-doctor-success.png`

### 3. Patient Panel - Lista de resultados
- [ ] Screenshot guardado: `docs/screenshots/03-patient-list.png`

### 4. Patient Panel - Resultado descifrado
- [ ] Screenshot guardado: `docs/screenshots/04-patient-decrypted.png`

### 5. Arkiv Explorer - Entidad verificada
- [ ] Screenshot guardado: `docs/screenshots/05-arkiv-explorer.png`

### 6. Browser Console - Logs sin errores
- [ ] Screenshot guardado: `docs/screenshots/06-console-logs.png`

---

## 🐛 Bugs Encontrados

### Bug #1: [Título]
- **Severidad**: 🔴 Alta / 🟡 Media / 🟢 Baja
- **Descripción**:
- **Pasos para reproducir**:
- **Esperado**:
- **Actual**:

*(Agregar más bugs si se encuentran)*

---

## ✅ Resumen Final

### Tests Ejecutados: __/4
- [ ] TEST 1: Doctor Creates Result
- [ ] TEST 2: Patient Retrieves Result
- [ ] TEST 3: Wrong Wallet (Negative)
- [ ] TEST 4: Arkiv Explorer Verification

### Bugs Encontrados: __
### Screenshots Capturados: __/6

### Notas Adicionales:
- 
- 
- 

---

## 🚀 Próximos Pasos

Después de completar testing:
1. [ ] Crear directorio `/docs/screenshots/`
2. [ ] Guardar todos los screenshots
3. [ ] Documentar Entity Key de ejemplo
4. [ ] Actualizar BACKLOG.md con bugs encontrados
5. [ ] Marcar ZKD-301 como completado
6. [ ] Continuar con ZKD-401 (Deploy Vercel)

---

**Tester**: _______________  
**Fecha completado**: _______________  
**Status**: 🟡 EN PROGRESO
