# LLAVE - Gestor de Contraseñas E2E

Gestor de contraseñas con cifrado de extremo a extremo, autenticación con Google y desbloqueo con biometría (WebAuthn/Passkeys).

## Características

- 🔐 **Cifrado E2E**: Todo se cifra en el navegador con AES-GCM 256
- 🔑 **WebAuthn/Passkeys**: Desbloqueo con huella/rostro
- 📱 **Auto-lock**: Bloqueo automático por inactividad
- 🔒 **Zero-knowledge**: El servidor nunca ve datos en claro
- 📋 **Clipboard hygiene**: Limpieza automática del portapapeles
- 📤 **Export/Import**: Backup cifrado del cofre
- 🚀 **Deploy Ready**: Configurado para Railway

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma + PostgreSQL
- **Auth**: NextAuth.js v4 + Google OAuth
- **Crypto**: Web Crypto API (PBKDF2 + AES-GCM)
- **WebAuthn**: @simplewebauthn
- **Deploy**: Railway + Docker

## Setup Local

1. **Clonar y instalar dependencias**
   ```bash
   git clone <repo-url>
   cd llave
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Completar en `.env`:
   - `DATABASE_URL`: URL de PostgreSQL
   - `GOOGLE_CLIENT_ID`: ID de cliente de Google OAuth
   - `GOOGLE_CLIENT_SECRET`: Secret de cliente de Google OAuth
   - `NEXTAUTH_SECRET`: Secret aleatorio para NextAuth
   - `NEXTAUTH_URL`: URL de la app (http://localhost:3000 para desarrollo)

3. **Configurar base de datos**
   ```bash
   npm run prisma:migrate
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🚀 Deploy en Railway

### Opción 1: Deploy Automático (Recomendado)

1. **Crear repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/llave.git
   git push -u origin main
   ```

2. **Configurar Railway**
   - Ir a [Railway](https://railway.app)
   - Crear cuenta o iniciar sesión
   - Click en "New Project"
   - Seleccionar "Deploy from GitHub repo"
   - Conectar tu cuenta de GitHub
   - Seleccionar el repositorio `llave`

3. **Agregar Base de Datos**
   - En el proyecto de Railway, click en "New"
   - Seleccionar "Database" → "PostgreSQL"
   - Railway automáticamente configurará `DATABASE_URL`

4. **Configurar Variables de Entorno**
   - En el proyecto, ir a la pestaña "Variables"
   - Agregar las siguientes variables:
   ```
   NEXTAUTH_URL=https://tu-app.railway.app
   NEXTAUTH_SECRET=tu-secret-aleatorio-aqui
   GOOGLE_CLIENT_ID=tu-google-client-id
   GOOGLE_CLIENT_SECRET=tu-google-client-secret
   ```

5. **Generar NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

6. **Configurar Google OAuth**
   - Ir a [Google Cloud Console](https://console.cloud.google.com)
   - Crear proyecto o seleccionar existente
   - Habilitar "Google+ API"
   - Crear credenciales OAuth 2.0
   - Configurar URIs autorizados:
     - `http://localhost:3000` (desarrollo)
     - `https://tu-app.railway.app` (producción)
   - Copiar Client ID y Client Secret a Railway

7. **Deploy**
   - Railway automáticamente detectará el Dockerfile
   - El deploy comenzará automáticamente
   - Una vez completado, tendrás tu URL de producción

### Opción 2: Deploy Manual

1. **Instalar Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login a Railway**
   ```bash
   railway login
   ```

3. **Inicializar proyecto**
   ```bash
   railway init
   ```

4. **Agregar variables de entorno**
   ```bash
   railway variables set NEXTAUTH_URL=https://tu-app.railway.app
   railway variables set NEXTAUTH_SECRET=tu-secret-aleatorio
   railway variables set GOOGLE_CLIENT_ID=tu-google-client-id
   railway variables set GOOGLE_CLIENT_SECRET=tu-google-client-secret
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Configuración de Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto o seleccionar existente
3. Habilitar "Google+ API"
4. Crear credenciales OAuth 2.0
5. Configurar URIs autorizados:
   - `http://localhost:3000` (desarrollo)
   - `https://tu-app.railway.app` (producción)
6. Copiar Client ID y Client Secret a las variables de entorno

## Uso

1. **Primer acceso**: Login con Google
2. **Configurar passkey**: Registrar credencial biométrica
3. **Agregar contraseñas**: Crear entradas en el cofre
4. **Desbloquear**: Usar passkey o passphrase de fallback
5. **Auto-lock**: Se bloquea automáticamente después de 5 minutos de inactividad

## Seguridad

- **Cifrado E2E**: AES-GCM 256 con nonce único por cifrado
- **Derivación de clave**: PBKDF2 con 310,000 iteraciones
- **WebAuthn**: Credenciales de plataforma seguras
- **Rate limiting**: Protección contra ataques de fuerza bruta
- **CSP**: Content Security Policy estricta
- **CSRF**: Protección automática vía NextAuth

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth
│   │   ├── vault/         # CRUD del cofre
│   │   └── webauthn/      # WebAuthn endpoints
│   ├── (auth)/            # Páginas de autenticación
│   └── vault/             # Página principal del cofre
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades
│   ├── auth.ts           # Configuración NextAuth
│   ├── crypto-client.ts  # Criptografía del cliente
│   ├── webauthn.ts       # Helpers WebAuthn
│   ├── ratelimit.ts      # Rate limiting
│   ├── prisma.ts         # Cliente Prisma
│   └── base64.ts         # Utilidades Base64
└── types/                # Tipos TypeScript
```

## Scripts Disponibles

- `npm run dev`: Desarrollo local
- `npm run build`: Build de producción
- `npm run start`: Servidor de producción
- `npm run lint`: Linting con ESLint
- `npm run prisma:generate`: Generar cliente Prisma
- `npm run prisma:migrate`: Ejecutar migraciones
- `npm run prisma:deploy`: Deploy de migraciones

## Troubleshooting

### Problemas Comunes

1. **Error de build en Railway**
   - Verificar que todas las variables de entorno estén configuradas
   - Revisar los logs en Railway para más detalles

2. **Error de autenticación**
   - Verificar que las credenciales de Google OAuth estén correctas
   - Asegurar que las URIs autorizadas incluyan la URL de Railway

3. **Error de base de datos**
   - Verificar que `DATABASE_URL` esté configurada correctamente
   - Ejecutar migraciones: `npm run prisma:deploy`

4. **WebAuthn no funciona**
   - Asegurar que el sitio use HTTPS en producción
   - Verificar que el dominio esté configurado correctamente

## Contribuir

1. Fork el proyecto
2. Crear feature branch
3. Commit cambios
4. Push al branch
5. Abrir Pull Request

## Licencia

MIT
