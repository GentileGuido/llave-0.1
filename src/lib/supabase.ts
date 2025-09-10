import { createClient } from '@supabase/supabase-js'
import { authConfig, validateAuthConfig } from './auth-config'

// Validar configuración al importar
const configValidation = validateAuthConfig()
if (!configValidation.isValid) {
  console.warn('⚠️ Configuración de autenticación incompleta:', configValidation.errors)
}

const supabaseUrl = authConfig.supabase.url
const supabaseAnonKey = authConfig.supabase.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función helper para login con Google
export async function signInWithGoogle() {
  // Forzar el uso de la URL pública en lugar de localhost
  const redirectUrl = 'https://llaveapp.com/auth/callback'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }

  return data
}

// Función helper para logout
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}