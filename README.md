# LLAVE - Gestor de Contraseñas E2E

Gestor de contraseñas con cifrado de extremo a extremo, autenticación con Google y desbloqueo con biometría (WebAuthn/Passkeys).

## Características

- 🔐 **Cifrado E2E**: Todo se cifra en el navegador con AES-GCM 256
- 🔑 **WebAuthn/Passkeys**: Desbloqueo con huella/rostro
- 📱 **Auto-lock**: Bloqueo automático por inactividad
- 🔒 **Zero-knowledge**: El servidor nunca ve datos en claro
- 📋 **Clipboard hygiene**: Limpieza automática del portapapeles
- 📤 **Export/Import**: Backup cifrado del cofre

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma + PostgreSQL
- **Auth**: NextAuth.js v4 + Google OAuth
- **Crypto**: Web Crypto API (PBKDF2 + AES-GCM)
- **WebAuthn**: @simplewebauthn
- **Deploy**: Railway + GitHub Actions

## Setup Local

1. **Clonar y instalar dependencias**
   ```bash
   git clone <repo-url>
   cd llave
   pnpm install
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
   pnpm prisma migrate dev
   ```

4. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```

## Deploy en Railway

1. **Crear repositorio en GitHub**
   - Push del código a un repo público/privado

2. **Configurar Railway**
   - Ir a [Railway](https://railway.app)
   - "New Project" → "Deploy from GitHub repo"
   - Seleccionar el repo
   - Agregar addon "PostgreSQL"

3. **Configurar variables de entorno en Railway**
   - `DATABASE_URL`: Automático del addon PostgreSQL
   - `NEXTAUTH_URL`: URL de producción de Railway
   - `NEXTAUTH_SECRET`: Generar con `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID`: ID de Google OAuth
   - `GOOGLE_CLIENT_SECRET`: Secret de Google OAuth

4. **Configurar GitHub Secrets**
   - En el repo: Settings → Secrets and variables → Actions
   - Agregar `RAILWAY_TOKEN` con el token de Railway

5. **Deploy automático**
   - Push a `main` → deploy automático vía GitHub Actions

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
├── lib/                   # Utilidades
│   ├── auth.ts           # Configuración NextAuth
│   ├── crypto-client.ts  # Criptografía del cliente
│   ├── webauthn.ts       # Helpers WebAuthn
│   └── ratelimit.ts      # Rate limiting
└── types/                # Tipos TypeScript
```

## Scripts Disponibles

- `pnpm dev`: Desarrollo local
- `pnpm build`: Build de producción
- `pnpm start`: Servidor de producción
- `pnpm lint`: Linting con ESLint
- `pnpm prisma:generate`: Generar cliente Prisma
- `pnpm prisma:migrate`: Ejecutar migraciones
- `pnpm prisma:deploy`: Deploy de migraciones

## Contribuir

1. Fork el proyecto
2. Crear feature branch
3. Commit cambios
4. Push al branch
5. Abrir Pull Request

## Licencia

MIT
