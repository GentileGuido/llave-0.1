# Configuración de Mercado Pago para Llave

## 🚀 Pasos para vincular Mercado Pago

### 1. Crear cuenta de desarrollador
- Ve a: https://www.mercadopago.com.ar/developers
- Crea una cuenta o inicia sesión
- Ve a "Panel de desarrolladores"

### 2. Obtener credenciales ✅
- Access Token: `APP_USR-5727045942185884-091011-413240a45a7c860f1c5273928c6f7de8-200188121`
- Public Key: `APP_USR-8e2e4461-8ce5-428d-aa0c-6e130abd84fd`
- Client ID: `5727045942185884`
- Client Secret: `GRvKxRZLNDangzs6IUVLRFHRtMzYiJTI`

### 3. Configurar en Railway ✅
- Ve a Railway Dashboard → Variables
- Agrega: `MERCADOPAGO_ACCESS_TOKEN` = APP_USR-5727045942185884-091011-413240a45a7c860f1c5273928c6f7de8-200188121
- Agrega: `MERCADOPAGO_PUBLIC_KEY` = APP_USR-8e2e4461-8ce5-428d-aa0c-6e130abd84fd

### 4. Configurar webhook (opcional)
- En Mercado Pago, ve a "Webhooks"
- URL: `https://llaveapp.com/api/mp-webhook`
- Eventos: `payment`

### 5. Probar donaciones
- Usa montos pequeños para probar
- Verifica que las redirecciones funcionen
- Revisa los logs en Railway

## 💰 Montos de donación
- 🧃 Jugo: $5.000
- 🍕 Pizza: $10.000
- 📚 Libro: $15.000
- 🚗 Auto: $20.000

## 🔧 URLs de retorno
- Success: `/donation/success`
- Error: `/donation/error`
- Pending: `/donation/pending`

## 📝 Notas importantes
- Las donaciones se procesan en pesos argentinos (ARS)
- Mercado Pago maneja automáticamente la conversión de moneda
- Los webhooks son opcionales pero recomendados para tracking
- Usa siempre HTTPS en producción
