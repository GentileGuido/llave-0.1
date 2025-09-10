import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  
  // Forzar el uso de la URL pública
  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'

  console.log('🔍 Auth callback recibido:', { code: !!code, next })

  if (code) {
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jlmfkgmluwkbfcapjsni.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbWZrZ21sdXdrYmZjYXBqc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTU3ODIsImV4cCI6MjA3MzAzMTc4Mn0.RKNUviCI45FL5C80OK5EfY6rq42hxc7l2e7Er9ooipg',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error en exchangeCodeForSession:', error)
        return NextResponse.redirect(`${publicOrigin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
      }
      
      if (data.session) {
        console.log('✅ Sesión creada exitosamente:', data.session.user?.email)
        return NextResponse.redirect(`${publicOrigin}${next}`)
      } else {
        console.log('⚠️ No se creó sesión')
        return NextResponse.redirect(`${publicOrigin}/auth/auth-code-error?error=no_session`)
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error)
      return NextResponse.redirect(`${publicOrigin}/auth/auth-code-error?error=unexpected`)
    }
  }

  // Si no hay código, pero hay un token en el hash, redirigir a la página principal
  // para que el cliente lo procese
  console.log('⚠️ No se recibió código de autorización, redirigiendo a página principal')
  return NextResponse.redirect(`${publicOrigin}/?auth_processing=true`)
}
