# 📋 BACKLOG - zk-doctor Migration & Launch

**Project**: zk-doctor (Arkiv/Polkadot)  
**Previous**: ZKPJWT (Arbitrum)  
**Status**: Backend Architecture Complete - Testing Phase  
**Target**: Sub0 Polkadot Hackathon  
**Date**: 16 de noviembre de 2025

**IMPORTANT NOTE**: Arkiv SDK is Node.js only and cannot run in browsers. Architecture updated to use Backend API (Express + Arkiv SDK) with Frontend (React + Fetch API).

---

## 🎯 EPIC 1: Repository Cleanup & Documentation

### 🎫 TICKET #ZKD-101 — Limpieza de archivos legacy de Arbitrum

**Prioridad**: 🔴 ALTA  
**Estimación**: 30 minutos  
**Tipo**: Technical Debt

#### 📝 Descripción

Eliminar todos los archivos, documentación y configuraciones relacionadas con el proyecto anterior ZKPJWT que ya no son relevantes para zk-doctor en Arkiv/Polkadot.

#### 🎯 Caso de Uso

Como desarrollador del proyecto zk-doctor, necesito un repositorio limpio sin archivos legacy de Arbitrum para evitar confusión y mantener el proyecto enfocado en Arkiv/Polkadot.

#### ✅ Criterios de Aceptación

- [x] **AC-1**: Archivos Markdown obsoletos eliminados ✅ COMPLETED
- [x] **AC-2**: Directorio `contracts/` eliminado o archivado ✅ COMPLETED
- [x] **AC-3**: Directorio `circuits/` eliminado o archivado ✅ COMPLETED
- [x] **AC-4**: Directorio `zkpjwt-stylus/` eliminado o archivado ✅ COMPLETED
- [x] **AC-5**: Script `test-all.sh` actualizado o eliminado ✅ COMPLETED
- [x] **AC-6**: Crear directorio `archive/` ✅ COMPLETED

**STATUS**: ✅ COMPLETED - All legacy files archived to /archive/

#### 🚀 Comandos de Ejecución

```bash
# Opción A: Eliminar completamente
rm -rf contracts/ circuits/ zkpjwt-stylus/
rm DEPLOYMENT.md DEPLOYMENT_SUMMARY.md DEMO_SCRIPT.md \
   EXECUTIVE_SUMMARY.md INDEX.md QUICKSTART.md STATUS.md \
   SUBMISSION_CHECKLIST.md TASKS.md TESTING_GUIDE.md \
   UX_FLOW.md contexto.md test-all.sh

# Opción B: Archivar (recomendado)
mkdir archive
mv contracts circuits zkpjwt-stylus archive/
mv DEPLOYMENT*.md DEMO_SCRIPT.md EXECUTIVE_SUMMARY.md \
   INDEX.md QUICKSTART.md STATUS.md SUBMISSION_CHECKLIST.md \
   TASKS.md TESTING_GUIDE.md UX_FLOW.md contexto.md \
   test-all.sh archive/
```

#### 📦 Commit Message

```
feat(cleanup): remove Arbitrum legacy files and documentation

- Archived contracts/, circuits/, zkpjwt-stylus/ directories
- Removed outdated Arbitrum-specific markdown files
- Cleaned up test scripts and deployment docs
- Prepared repository for zk-doctor (Arkiv/Polkadot) focus

TICKET: ZKD-101
```

---

### 🎫 TICKET #ZKD-102 — Crear README.md principal para zk-doctor

**Prioridad**: 🔴 ALTA  
**Estimación**: 45 minutos  
**Tipo**: Documentation

#### 📝 Descripción

Crear un README.md profesional y completo que explique el proyecto zk-doctor, su arquitectura con Arkiv, y cómo usarlo.

#### 🎯 Caso de Uso

Como visitante del repositorio o juez del hackathon, necesito entender rápidamente qué es zk-doctor, cómo funciona, y cómo probarlo, para evaluar el proyecto correctamente.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Sección de Overview clara
  - Explicación de qué es zk-doctor
  - Problema que resuelve
  - Tecnologías usadas (Arkiv, Polkadot, ZK encryption)

- [ ] **AC-2**: Arquitectura visual
  - Diagrama en ASCII o link a imagen
  - Explicación de componentes (Doctor/Patient/Arkiv)

- [ ] **AC-3**: Quick Start funcional
  - Comandos para instalar
  - Comandos para correr localmente
  - URL de demo si está deployed

- [ ] **AC-4**: Guía de uso paso a paso
  - Cómo usar panel Doctor
  - Cómo usar panel Patient
  - Screenshots o GIFs (opcional)

- [ ] **AC-5**: Detalles técnicos
  - Estructura de proyecto
  - Integración con Arkiv SDK
  - Método de cifrado usado

- [ ] **AC-6**: Información del hackathon
  - Track: Arkiv
  - Features demostradas
  - Links relevantes

- [ ] **AC-7**: Sección de seguridad
  - Disclaimer de MVP
  - Consideraciones de producción

#### 📦 Commit Message

```
docs(readme): create comprehensive README.md for zk-doctor

- Added project overview and architecture diagram
- Included quick start guide and usage instructions
- Documented Arkiv integration and encryption method
- Added hackathon submission information
- Included security considerations for production

TICKET: ZKD-102
```

---

### 🎫 TICKET #ZKD-103 — Crear ARKIV_INTEGRATION.md con Developer Experience

**Prioridad**: 🟡 MEDIA  
**Estimación**: 30 minutos  
**Tipo**: Documentation

#### 📝 Descripción

Documentar la experiencia de integrar Arkiv SDK, incluyendo challenges, soluciones, y feedback para el equipo de Arkiv.

#### 🎯 Caso de Uso

Como equipo de Arkiv o desarrollador futuro, necesito entender qué funciones del SDK se usaron, qué problemas se encontraron, y qué mejoras se sugieren, para evaluar y mejorar la developer experience.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Sección "SDK Features Used"
  - Lista de funciones/métodos usados
  - Ejemplos de código
  - Casos de uso específicos

- [ ] **AC-2**: Sección "Developer Experience"
  - Qué funcionó bien ✅
  - Qué fue confuso ⚠️
  - Qué faltó en la documentación ❌

- [ ] **AC-3**: Sección "Code Examples"
  - Ejemplo de createEntity
  - Ejemplo de buildQuery con annotations
  - Ejemplo de expiresIn (TTL)

- [ ] **AC-4**: Sección "Challenges & Solutions"
  - Problemas encontrados
  - Cómo se resolvieron
  - Workarounds aplicados

- [ ] **AC-5**: Sección "Suggestions for Improvement"
  - Mejoras de API
  - Mejoras de documentación
  - Features deseadas

- [ ] **AC-6**: Comparación con otras soluciones
  - vs IPFS
  - vs Traditional databases
  - Ventajas de Arkiv

#### 📦 Commit Message

```
docs(arkiv): add developer experience documentation

- Documented Arkiv SDK features used in zk-doctor
- Detailed challenges encountered and solutions applied
- Provided feedback on developer experience
- Included code examples and best practices
- Added suggestions for Arkiv team improvement

TICKET: ZKD-103
```

---

### 🎫 TICKET #ZKD-104 — Actualizar package.json metadata

**Prioridad**: 🟡 MEDIA  
**Estimación**: 15 minutos  
**Tipo**: Configuration

#### 📝 Descripción

Actualizar los metadatos del package.json principal y del demo para reflejar el proyecto zk-doctor en lugar de ZKPJWT.

#### 🎯 Caso de Uso

Como usuario que instala el paquete o revisa el proyecto, necesito ver metadatos correctos (nombre, descripción, keywords) que reflejen el proyecto actual de zk-doctor en Polkadot.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: `/package.json` actualizado
  - `name`: "zk-doctor" o "@zk-doctor/monorepo"
  - `description`: Descripción de medical records en Arkiv
  - `keywords`: ["arkiv", "polkadot", "medical", "encryption", "zk"]
  - `repository`: URL correcta (github.com/ETHcali/zk-doctor)

- [ ] **AC-2**: `/demo/package.json` actualizado
  - `name`: "zk-doctor-demo" o "@zk-doctor/demo"
  - `description`: "Frontend demo for zk-doctor on Arkiv"
  - `keywords`: añadir Arkiv-related

- [ ] **AC-3**: `/library/package.json` actualizado (si se mantiene)
  - `name`: "zkpjwt-mvp" o "@zk-doctor/crypto"
  - `description`: Actualizada para medical use case
  - `keywords`: actualizar

- [ ] **AC-4**: Verificar dependencies
  - Eliminar dependencies no usadas (ej: ethers si solo es crypto)
  - Asegurar @arkiv-network/sdk está listada

#### 📦 Commit Message

```
chore(config): update package.json metadata for zk-doctor

- Changed project name from ZKPJWT to zk-doctor
- Updated descriptions to reflect Arkiv/Polkadot focus
- Added relevant keywords (arkiv, medical, encryption)
- Updated repository URLs
- Cleaned up unused dependencies

TICKET: ZKD-104
```

---

## 🎯 EPIC 2: Code Refinement & Bug Fixes

### 🎫 TICKET #ZKD-201 — Corregir errores de compilación en DoctorPanel

**Prioridad**: 🔴 ALTA  
**Estimación**: 20 minutos  
**Tipo**: Bug Fix

**STATUS**: ✅ COMPLETED - Component syntax was already correct

#### 📝 Descripción

El componente DoctorPanel.tsx tiene un error de sintaxis en el `<select>` que genera errores de TypeScript.

#### 🎯 Caso de Uso

Como desarrollador compilando el proyecto, necesito que DoctorPanel compile sin errores para poder hacer build y deploy correctamente.

#### ✅ Criterios de Aceptación

- [x] **AC-1**: ✅ COMPLETED - Component syntax verified correct (no issues found)

- [x] **AC-2**: ✅ COMPLETED - TypeScript compiles without errors

- [x] **AC-3**: ✅ COMPLETED - Functionality verified intact

#### 📦 Commit Message

```
fix(doctor-panel): correct select option syntax error

- Fixed invalid JSX syntax on test type dropdown
- Changed <key={type}> to <option key={type}>
- Resolved TypeScript compilation errors
- Verified functionality remains intact

TICKET: ZKD-201
```

---

### 🎫 TICKET #ZKD-202 — Mejorar manejo de errores en arkivService

**Prioridad**: 🟡 MEDIA  
**Estimación**: 30 minutos  
**Tipo**: Enhancement

#### 📝 Descripción

Mejorar el manejo de errores en arkivService.ts para proporcionar mensajes más descriptivos al usuario final.

#### 🎯 Caso de Uso

Como paciente o doctor usando la aplicación, necesito mensajes de error claros cuando algo falla con Arkiv, para entender qué hacer (ej: "sin fondos", "network error", etc).

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Detectar tipos específicos de errores
  - Insufficient funds
  - Network timeout
  - Invalid entity key
  - Query returns empty

- [ ] **AC-2**: Mensajes descriptivos en español
  - "No tienes fondos suficientes en tu wallet"
  - "Error de conexión con Arkiv. Verifica tu internet"
  - "No se encontró el resultado médico"

- [ ] **AC-3**: Logging estructurado
  - console.error con contexto
  - Incluir entityKey o queryParams en logs

- [ ] **AC-4**: Retry logic (opcional)
  - Reintentar 3 veces en caso de network error
  - Exponential backoff

#### 📦 Commit Message

```
feat(arkiv-service): improve error handling and user messages

- Added specific error type detection
- Implemented descriptive Spanish error messages
- Added structured logging with context
- Included retry logic for network errors

TICKET: ZKD-202
```

---

### 🎫 TICKET #ZKD-203 — Agregar validación de wallet address en formularios

**Prioridad**: 🟡 MEDIA  
**Estimación**: 20 minutos  
**Tipo**: Enhancement

#### 📝 Descripción

Agregar validación en tiempo real del formato de wallet address en DoctorPanel para prevenir errores.

#### 🎯 Caso de Uso

Como doctor ingresando un wallet del paciente, necesito feedback inmediato si el formato es inválido, para evitar crear resultados que no podrán ser recuperados.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Validación de formato
  - Regex: `/^0x[a-fA-F0-9]{40}$/`
  - Validar mientras escribe (onChange)

- [ ] **AC-2**: Feedback visual
  - Border rojo si inválido
  - Checkmark verde si válido
  - Mensaje de error debajo del input

- [ ] **AC-3**: Botón deshabilitado
  - No permitir submit si wallet inválida
  - Tooltip explicando el formato correcto

- [ ] **AC-4**: Normalización automática
  - Convertir a lowercase al guardar
  - Trim espacios en blanco

#### 📦 Commit Message

```
feat(doctor-panel): add wallet address validation

- Added real-time regex validation for Ethereum addresses
- Implemented visual feedback (red border / green checkmark)
- Disabled submit button if wallet is invalid
- Added auto-normalization (lowercase, trim)

TICKET: ZKD-203
```

---

## 🎯 EPIC 3: Testing & Quality Assurance

### 🎫 TICKET #ZKD-301 — Testing E2E del flujo completo

**Prioridad**: 🔴 ALTA  
**Estimación**: 60 minutos  
**Tipo**: Testing

#### 📝 Descripción

Realizar testing end-to-end completo del flujo doctor → Arkiv → patient para asegurar que todo funciona correctamente antes del deploy.

#### 🎯 Caso de Uso

Como desarrollador antes del deploy, necesito verificar que el flujo completo funciona sin errores para asegurar una demo exitosa en el hackathon.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Obtener fondos de faucet
  - Visitar https://faucet.mendoza.arkiv.network/
  - Obtener tokens para wallet de prueba
  - Verificar balance

- [ ] **AC-2**: Test flujo Doctor
  - Abrir http://localhost:5173/
  - Tab "Doctor"
  - Completar formulario:
    - Nombre: "John Doe"
    - Wallet: [tu wallet de prueba]
    - Test: "Blood Test"
    - Resultado 1: "Glucose" = "95 mg/dL"
    - Resultado 2: "Cholesterol" = "180 mg/dL"
    - Notas: "Patient is healthy"
  - Click "Generate Encrypted Result"
  - Verificar:
    - ✅ Status "Guardando en Arkiv..."
    - ✅ Status "Resultado guardado exitosamente"
    - ✅ Entity Key mostrado
    - ✅ TX Hash mostrado (o N/A)

- [ ] **AC-3**: Verificar en Arkiv Explorer
  - Copiar Entity Key
  - Visitar https://explorer.mendoza.arkiv.network/
  - Buscar entity
  - Verificar metadata (doctor, patient, timestamp)

- [ ] **AC-4**: Test flujo Patient
  - Tab "Patient"
  - Click "Connect Wallet"
  - Conectar MetaMask con wallet de prueba
  - Click "Actualizar Resultados"
  - Verificar:
    - ✅ Query exitoso
    - ✅ Resultado aparece en lista
    - ✅ Muestra doctor, fecha, entity key

- [ ] **AC-5**: Test descifrado
  - Click "Descifrar" en resultado
  - Verificar:
    - ✅ Status "Descifrando..."
    - ✅ Status "Resultado descifrado exitosamente"
    - ✅ Datos mostrados correctamente:
      - Nombre: John Doe
      - Test: Blood Test
      - Resultados: Glucose 95 mg/dL, Cholesterol 180 mg/dL
      - Notas: Patient is healthy

- [ ] **AC-6**: Test wallet incorrecta (negative test)
  - Conectar wallet diferente
  - Intentar descifrar
  - Verificar:
    - ❌ Error "Solo el paciente autorizado puede descifrar"

- [ ] **AC-7**: Documentar con screenshots
  - Captura de formulario doctor
  - Captura de resultado guardado
  - Captura de Arkiv explorer
  - Captura de lista patient
  - Captura de resultado descifrado
  - Guardar en `/docs/screenshots/`

#### 📦 Commit Message

```
test(e2e): complete end-to-end testing of doctor-patient flow

- Obtained Mendoza testnet funds from faucet
- Tested doctor creates encrypted result workflow
- Verified entity creation on Arkiv explorer
- Tested patient queries and decrypts results
- Confirmed encryption works with correct wallet
- Verified error handling with incorrect wallet
- Added screenshots documentation

TICKET: ZKD-301
```

---

### 🎫 TICKET #ZKD-302 — Crear guía de testing manual

**Prioridad**: 🟢 BAJA  
**Estimación**: 20 minutos  
**Tipo**: Documentation

#### 📝 Descripción

Crear una guía paso a paso de testing manual para que otras personas puedan probar el proyecto fácilmente.

#### 🎯 Caso de Uso

Como juez del hackathon o colaborador, necesito una guía clara de cómo probar zk-doctor localmente, para evaluar su funcionalidad sin necesidad de entender el código.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Crear `TESTING.md`
  - Prerequisitos (MetaMask, fondos)
  - Setup local
  - Paso a paso doctor
  - Paso a paso patient
  - Casos de test negativos

- [ ] **AC-2**: Incluir troubleshooting
  - "No veo resultados" → verificar wallet correcta
  - "Error al descifrar" → verificar wallet del paciente
  - "Sin fondos" → link al faucet

- [ ] **AC-3**: Checklist visual
  - [ ] Checkboxes para cada paso
  - Screenshots de referencia
  - Expected results claros

#### 📦 Commit Message

```
docs(testing): add manual testing guide

- Created comprehensive TESTING.md guide
- Included step-by-step instructions for both portals
- Added troubleshooting section
- Provided testing checklist with screenshots

TICKET: ZKD-302
```

---

## 🎯 EPIC 4: Deployment & Launch

### 🎫 TICKET #ZKD-401 — Deploy a Vercel

**Prioridad**: 🔴 ALTA  
**Estimación**: 30 minutos  
**Tipo**: Deployment

#### 📝 Descripción

Desplegar la aplicación zk-doctor a Vercel para tener una demo pública accesible para el hackathon.

#### 🎯 Caso de Uso

Como juez del hackathon, necesito acceder a una demo en vivo de zk-doctor sin tener que instalar nada localmente, para evaluar el proyecto rápidamente.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Configurar proyecto en Vercel
  - Conectar repositorio GitHub
  - Framework: Vite
  - Build Command: `cd demo && npm run build`
  - Output Directory: `demo/dist`

- [ ] **AC-2**: Variables de entorno configuradas
  - `VITE_DOCTOR_PRIVATE_KEY` (si es necesaria)
  - Verificar que crypto polyfills funcionan en producción

- [ ] **AC-3**: Build exitoso
  - No errores en build logs
  - Bundle size aceptable (<2MB)
  - Verificar crypto-browserify incluido

- [ ] **AC-4**: Verificar funcionalidad en producción
  - Doctor panel funcional
  - Patient panel funcional
  - Wallet connection funciona
  - Arkiv queries funcionan
  - Encryption/decryption funciona

- [ ] **AC-5**: Dominio personalizado (opcional)
  - zk-doctor.vercel.app
  - O dominio custom si disponible

- [ ] **AC-6**: Actualizar README con URL
  - Link a demo: https://zk-doctor.vercel.app
  - Badge de status de deploy

#### 📦 Commit Message

```
deploy(vercel): launch zk-doctor production deployment

- Configured Vercel project with Vite framework
- Set up build commands and output directory
- Configured environment variables for production
- Verified all functionality works in production
- Updated README with live demo URL

TICKET: ZKD-401
Live: https://zk-doctor.vercel.app
```

---

### 🎫 TICKET #ZKD-402 — Crear video demo de 2-3 minutos

**Prioridad**: 🔴 ALTA  
**Estimación**: 45 minutos  
**Tipo**: Documentation

#### 📝 Descripción

Grabar un video demo profesional mostrando el flujo completo de zk-doctor para la submission del hackathon.

#### 🎯 Caso de Uso

Como juez del hackathon sin tiempo para probar manualmente, necesito un video claro que demuestre todas las features de zk-doctor en 2-3 minutos.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Script del video preparado
  ```
  0:00-0:15 - Intro: "zk-doctor on Arkiv"
  0:15-0:30 - Problema: "Medical privacy"
  0:30-1:00 - Demo Doctor Portal
  1:00-1:30 - Demo Patient Portal
  1:30-2:00 - Arkiv Explorer verification
  2:00-2:30 - Security demonstration
  2:30-2:45 - Tech stack & benefits
  2:45-3:00 - Call to action
  ```

- [ ] **AC-2**: Video grabado
  - Herramienta: Loom, OBS, o QuickTime
  - Resolución: 1080p mínimo
  - Audio claro (microfono decente)
  - Sin background noise

- [ ] **AC-3**: Contenido del video
  - Mostrar flujo doctor completo
  - Mostrar flujo patient completo
  - Highlight Arkiv features:
    - Annotations for querying
    - TTL (30 days expiration)
    - No gas fees vs blockchain
  - Mostrar código brevemente (5-10 seg)
  - Mencionar tech stack

- [ ] **AC-4**: Post-producción
  - Agregar subtítulos (opcional)
  - Agregar música de fondo suave
  - Cortar partes lentas
  - Agregar slides con:
    - Título del proyecto
    - Tech stack icons
    - GitHub link
    - Contact info

- [ ] **AC-5**: Subir a YouTube/Loom
  - Título: "zk-doctor - Private Medical Records on Arkiv (Polkadot)"
  - Descripción con links
  - Tags: arkiv, polkadot, healthcare, encryption
  - Visibilidad: Unlisted o Public

- [ ] **AC-6**: Agregar link al README
  - Sección "Demo Video"
  - Embed o link directo

#### 📦 Commit Message

```
docs(demo): add 2-minute video demonstration

- Created comprehensive demo video script
- Recorded doctor and patient portal workflows
- Highlighted Arkiv SDK features and benefits
- Added professional editing and subtitles
- Uploaded to YouTube with proper metadata
- Embedded video link in README

TICKET: ZKD-402
Video: https://youtu.be/[VIDEO_ID]
```

---

### 🎫 TICKET #ZKD-403 — Preparar submission del hackathon

**Prioridad**: 🔴 ALTA  
**Estimación**: 30 minutos  
**Tipo**: Documentation

#### 📝 Descripción

Preparar todos los materiales necesarios para la submission final del hackathon Sub0 Polkadot.

#### 🎯 Caso de Uso

Como participante del hackathon, necesito compilar toda la información requerida (descripción, video, links, tech stack) para hacer una submission completa y competitiva.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Crear `SUBMISSION.md`
  - Project name: zk-doctor
  - Tagline: "Private Medical Records on Arkiv"
  - Description (200 palabras)
  - Problem statement
  - Solution overview
  - Tech stack
  - Track: Arkiv

- [ ] **AC-2**: Compilar links necesarios
  - GitHub: https://github.com/ETHcali/zk-doctor
  - Demo: https://zk-doctor.vercel.app
  - Video: https://youtu.be/[ID]
  - Docs: Link al README
  - Arkiv Explorer: Link a entity example

- [ ] **AC-3**: Documentar features de Arkiv usadas
  - ✅ createWalletClient
  - ✅ createPublicClient
  - ✅ createEntity
  - ✅ buildQuery with annotations
  - ✅ ExpirationTime (TTL)
  - ✅ Queryable metadata

- [ ] **AC-4**: Agregar screenshots
  - Hero image (home page)
  - Doctor panel screenshot
  - Patient panel screenshot
  - Arkiv explorer screenshot
  - Code snippet (arkivService)

- [ ] **AC-5**: Team information
  - Nombre: Cristobal Valencia
  - GitHub: @ETHcali
  - Role: Full-stack Developer
  - Contact: [email o Twitter]

- [ ] **AC-6**: Completar formulario de submission
  - Acceder a hack.sub0.gg
  - Completar todos los campos
  - Subir materiales
  - Submit antes del deadline

#### 📦 Commit Message

```
docs(submission): prepare hackathon submission materials

- Created comprehensive SUBMISSION.md document
- Compiled all required links and resources
- Documented Arkiv SDK features demonstrated
- Added screenshots and code snippets
- Prepared team information and contacts
- Ready for final hackathon submission

TICKET: ZKD-403
Submission: Ready for hack.sub0.gg
```

---

## 🎯 EPIC 5: Optional Improvements (Post-MVP)

### 🎫 TICKET #ZKD-501 — Agregar múltiples idiomas (i18n)

**Prioridad**: 🟢 BAJA  
**Estimación**: 2 horas  
**Tipo**: Enhancement

#### 📝 Descripción

Implementar soporte multi-idioma (Español/Inglés) usando react-i18next para alcanzar audiencia internacional.

#### 🎯 Caso de Uso

Como usuario internacional del proyecto, necesito la interfaz en mi idioma preferido (inglés) para entender mejor la aplicación.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Instalar react-i18next
- [ ] **AC-2**: Crear archivos de traducción (es.json, en.json)
- [ ] **AC-3**: Traducir todos los strings de UI
- [ ] **AC-4**: Agregar language selector en header
- [ ] **AC-5**: Persistir preferencia en localStorage

#### 📦 Commit Message

```
feat(i18n): add internationalization support

- Implemented react-i18next
- Added English and Spanish translations
- Created language selector component
- Persisted language preference in localStorage

TICKET: ZKD-501
```

---

### 🎫 TICKET #ZKD-502 — Implementar real doctor authentication

**Prioridad**: 🟢 BAJA  
**Estimación**: 4 horas  
**Tipo**: Feature

#### 📝 Descripción

Reemplazar mock login del doctor con autenticación real usando Web3Auth o similar.

#### 🎯 Caso de Uso

Como doctor real, necesito autenticarme de manera segura para crear resultados médicos y tener mi identidad verificada.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Integrar Web3Auth o similar
- [ ] **AC-2**: Login con wallet doctor
- [ ] **AC-3**: Guardar doctor wallet en Arkiv annotations
- [ ] **AC-4**: Verificar firma digital de doctor
- [ ] **AC-5**: Implementar logout

#### 📦 Commit Message

```
feat(auth): implement real doctor authentication

- Integrated Web3Auth for doctor login
- Added wallet-based authentication
- Store doctor wallet in Arkiv annotations
- Implemented signature verification
- Added logout functionality

TICKET: ZKD-502
```

---

### 🎫 TICKET #ZKD-503 — Agregar export to PDF

**Prioridad**: 🟢 BAJA  
**Estimación**: 2 horas  
**Tipo**: Feature

#### 📝 Descripción

Permitir al paciente exportar sus resultados médicos descifrados a PDF para compartir o imprimir.

#### 🎯 Caso de Uso

Como paciente, necesito descargar mis resultados en PDF para compartir con otro doctor o guardar en mis archivos personales.

#### ✅ Criterios de Aceptación

- [ ] **AC-1**: Botón "Export to PDF" en resultado descifrado
- [ ] **AC-2**: Usar jsPDF o react-pdf
- [ ] **AC-3**: Formato profesional con logo
- [ ] **AC-4**: Incluir metadata (fecha, doctor, etc)
- [ ] **AC-5**: Descarga automática al hacer click

#### 📦 Commit Message

```
feat(export): add PDF export functionality for medical results

- Added "Export to PDF" button on decrypted results
- Implemented jsPDF for PDF generation
- Created professional medical report template
- Included all metadata and branding
- Auto-download on button click

TICKET: ZKD-503
```

---

## 📊 Resumen de Prioridades

### 🔴 CRÍTICO (Hacer Primero):
1. **ZKD-101** - Limpieza repository (30min)
2. **ZKD-102** - README principal (45min)
3. **ZKD-201** - Fix DoctorPanel syntax (20min)
4. **ZKD-301** - Testing E2E (60min)
5. **ZKD-401** - Deploy Vercel (30min)
6. **ZKD-402** - Video demo (45min)
7. **ZKD-403** - Submission (30min)

**Total tiempo crítico**: ~4 horas

### 🟡 IMPORTANTE (Hacer si hay tiempo):
- **ZKD-103** - ARKIV_INTEGRATION.md (30min)
- **ZKD-104** - package.json metadata (15min)
- **ZKD-202** - Error handling (30min)
- **ZKD-203** - Wallet validation (20min)

**Total tiempo importante**: ~1.5 horas

### 🟢 NICE TO HAVE (Post-hackathon):
- ZKD-302, ZKD-501, ZKD-502, ZKD-503

---

## 🎯 Plan de Ejecución Recomendado

### **Sprint 1: Cleanup & Documentation** (1.5h)
1. ✅ ZKD-101 - Limpieza
2. ✅ ZKD-102 - README
3. ✅ ZKD-104 - package.json

### **Sprint 2: Bug Fixes & Testing** (1.5h)
4. ✅ ZKD-201 - Fix DoctorPanel
5. ✅ ZKD-202 - Error handling
6. ✅ ZKD-301 - Testing E2E

### **Sprint 3: Deploy & Launch** (2h)
7. ✅ ZKD-401 - Deploy Vercel
8. ✅ ZKD-402 - Video demo
9. ✅ ZKD-103 - Arkiv docs
10. ✅ ZKD-403 - Submission

**Tiempo total estimado**: 5 horas

---

**Estado actual**: BACKLOG creado ✅  
**Próximo paso**: Ejecutar Sprint 1 (ZKD-101)

