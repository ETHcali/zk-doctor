# 🔐 EXPLICACIÓN DEL ERROR DE DESENCRIPTACIÓN

## ❌ Problema Actual

Estás viendo el error:
```
Error decrypting: Only the authorized patient can decrypt this result
```

## 🔍 Causa Raíz

**La wallet que estás usando para conectarte NO es la misma wallet que el doctor usó al crear el registro médico.**

### Cómo Funciona la Encriptación

```
┌─────────────────────────────────────────────────────────────────┐
│ PASO 1: Doctor crea registro                                    │
├─────────────────────────────────────────────────────────────────┤
│ Doctor ingresa:                                                  │
│ - Nombre: "Juan Pérez"                                          │
│ - Wallet del Paciente: 0xABC123... (WALLET A)                  │
│ - Resultados médicos                                             │
│                                                                  │
│ Sistema genera clave de encriptación:                            │
│ - Deriva clave AES-256 desde WALLET A                           │
│ - Encripta datos médicos con esa clave                          │
│ - Guarda en Arkiv                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ PASO 2: Paciente intenta desencriptar                           │
├─────────────────────────────────────────────────────────────────┤
│ Paciente conecta con MetaMask:                                   │
│ - Wallet conectada: 0xDEF456... (WALLET B)                     │
│                                                                  │
│ Sistema intenta desencriptar:                                    │
│ - Deriva clave AES-256 desde WALLET B                           │
│ - ❌ FALLA porque WALLET B ≠ WALLET A                           │
│ - Error: "Only the authorized patient can decrypt"              │
└─────────────────────────────────────────────────────────────────┘
```

## ✅ Solución

**Opción 1: Usa la wallet correcta**
1. Cuando el doctor crea el registro, ingresa: `0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821`
2. El paciente DEBE conectar con ESA MISMA wallet en MetaMask

**Opción 2: Crea un nuevo registro con la wallet que tienes**
1. Conecta MetaMask con la wallet: `0x7d70253e702954Ef9Ac2c0D74F9BE35F15524821`
2. Copia esa dirección
3. En el Doctor Panel, usa ESA dirección como "Patient Wallet"
4. Crea el registro
5. Ahora SÍ podrás desencriptarlo en el Patient Panel

## 🧪 Ejemplo Paso a Paso

### Crear Registro (Doctor Panel)
```
Patient Name: Test Patient
Patient Wallet: 0x7d70253e702954Ef9Ac2c0d74f9be35f15524821  ← COPIAR DESDE METAMASK
Test Type: Blood Test
Result Field: hemoglobin
Result Value: 14.5 g/dL
Notes: Test results
```

### Desencriptar (Patient Panel)
```
1. Click "Connect Wallet"
2. Autoriza con MetaMask
3. VERIFICAR que la wallet mostrada sea: 0x7d70253e702954Ef9Ac2c0d74f9be35f15524821
4. Click "Decrypt" en cualquier resultado
5. ✅ Debería funcionar
```

## 🔒 Por Qué Es Así

Este es el **modelo de seguridad** de zk-doctor:

- **Cada registro médico está encriptado con la wallet del paciente**
- **Solo ESA wallet puede desencriptar**
- **Ni el doctor, ni otros pacientes, ni nadie más puede ver los datos**
- **Es "zero-knowledge" porque los datos viajan encriptados**

Esto es BUENO para privacidad, pero significa que **la wallet del paciente debe coincidir exactamente**.

## 📊 Estado Actual de tus Registros

Basado en los logs del backend, tienes **3 registros guardados**:

| Entity Key | Patient Wallet | Estado |
|------------|---------------|--------|
| `0x2795660c...` | **Wallet desconocida** | ❌ No coincide con tu MetaMask |
| `0x932bc92d...` | **Wallet desconocida** | ❌ No coincide con tu MetaMask |
| `0x163635d0...` | **Wallet desconocida** | ❌ No coincide con tu MetaMask |

Todos estos registros fueron creados con una wallet diferente a `0x7d70253e...` que es la que tienes conectada ahora.

## 🎯 Próximos Pasos

1. **Decide qué wallet usar** - Anota la dirección completa
2. **Crea un nuevo registro** con ESA wallet
3. **Verifica que funcione** - Deberías poder desencriptar

O si prefieres:
4. **Cambia a la wallet original** que usaste para crear esos 3 registros
5. **Intenta desencriptar nuevamente**
