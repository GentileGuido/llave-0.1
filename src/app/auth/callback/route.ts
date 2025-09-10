import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  
  // Forzar el uso de la URL pública
  const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://llaveapp.com'

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
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${publicOrigin}${next}`)
    }
  }

  return NextResponse.redirect(`${publicOrigin}/auth/auth-code-error`)
}
