// Configuración de autenticación para Supabase + Google OAuth

export const authConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'}/auth/callback`
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jlmfkgmluwkbfcapjsni.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbWZrZ21sdXdrYmZjYXBqc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTU3ODIsImV4cCI6MjA3MzAzMTc4Mn0.RKNUviCI45FL5C80OK5EfY6rq42hxc7l2e7Er9ooipg'
  }
}

// Validar configuración (solo variables públicas)
export function validateAuthConfig() {
  const errors: string[] = []
  
  // Solo validar variables públicas (disponibles en el cliente)
  if (!authConfig.supabase.url) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL no está configurado')
  }
  
  if (!authConfig.supabase.anonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurado')
  }
  
  // Las credenciales de Google se validan en el servidor
  const hasGoogleConfig = authConfig.google.clientId && authConfig.google.clientSecret
  if (!hasGoogleConfig) {
    errors.push('Google OAuth no configurado en el servidor')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    hasGoogleConfig
  }
}
