# Configuración de Google OAuth para Llave

## Pasos para configurar Google OAuth

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** y **Google OAuth2 API**

### 2. Configurar credenciales OAuth

1. Ve a **APIs & Services** > **Credentials**
2. Haz clic en **Create Credentials** > **OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura las URLs autorizadas:
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (desarrollo)
     - `https://tu-dominio.com/auth/callback` (producción)

### 3. Configurar Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Authentication** > **Providers**
3. Habilita **Google** provider
4. Ingresa tu **Client ID** y **Client Secret** de Google
5. Configura la **Redirect URL** como: `https://tu-proyecto.supabase.co/auth/v1/callback`

### 4. Configurar variables de entorno

Crea un archivo `.env.local` con:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key_aqui"

# Google OAuth
GOOGLE_CLIENT_ID="tu_google_client_id_aqui"
GOOGLE_CLIENT_SECRET="tu_google_client_secret_aqui"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 5. Verificar configuración

1. Ejecuta `npm run dev`
2. Abre la consola del navegador
3. Verifica que no aparezcan errores de configuración
4. Intenta hacer login con Google

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que las URLs en Google Console coincidan exactamente
- Asegúrate de que no haya espacios extra o caracteres especiales

### Error: "invalid_client"
- Verifica que el Client ID y Client Secret sean correctos
- Asegúrate de que el proyecto de Google esté activo

### Error: "access_denied"
- Verifica que el dominio esté autorizado en Google Console
- Asegúrate de que la aplicación esté en modo de prueba o producción

## URLs importantes

- **Google Console**: https://console.cloud.google.com/apis/credentials
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentación Supabase Auth**: https://supabase.com/docs/guides/auth
