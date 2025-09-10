# Configuración de Mercado Pago

## 🔧 Variables necesarias en Railway:

```
MERCADOPAGO_ACCESS_TOKEN = [Tu Access Token de Mercado Pago]
MERCADOPAGO_PUBLIC_KEY = [Tu Public Key de Mercado Pago]
```

## 📋 Pasos para configurar:

1. **Obtener credenciales:**
   - Ve a: https://www.mercadopago.com.ar/developers
   - Panel → Credenciales → Copia tu Access Token y Public Key

2. **Agregar en Railway:**
   - Railway Dashboard → Variables
   - Agrega las dos variables con tus credenciales

3. **Redeploy:**
   - Railway automáticamente redeployará

## 💰 Montos de donación:
- 🧃 Jugo: $5.000
- 🍕 Pizza: $10.000
- 📚 Libro: $15.000
- 🚗 Auto: $20.000

## 🔒 Seguridad:
- **NUNCA** subas credenciales al repositorio
- Usa siempre variables de entorno
- Las credenciales van solo en Railway
