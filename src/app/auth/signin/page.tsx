'use client'

import { supabase } from '@/lib/supabase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    })

    if (error) {
      console.error('Error signing in:', error)
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/')
      }
    }
    checkUser()
  }, [router])

  return (
    <div className="pixel-container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      padding: '20px'
    }}>
      {/* Logo */}
      <div className="llave-logo" style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '3rem', color: 'var(--green-neon)' }}>🔑</div>
        <h1 className="pixel-title" style={{ 
          fontSize: '2.5rem', 
          margin: '10px 0',
          textShadow: 'none'
        }}>
          LLAVE
        </h1>
        <p className="pixel-subtitle" style={{ 
          fontSize: '1rem', 
          margin: '0',
          color: 'var(--text-white)'
        }}>
          El gestor de contraseñas que necesitabas
        </p>
      </div>

      {/* Google Auth Button */}
      <button
        onClick={handleGoogleSignIn}
        className="pixel-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '1.2rem',
          padding: '15px 30px',
          backgroundColor: 'var(--blue-electric)',
          borderColor: 'var(--blue-electric)',
          color: 'var(--text-white)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
          border: '2px solid var(--blue-electric)',
          minWidth: '280px'
        }}
      >
        {/* Google Logo SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continuar con Google</span>
      </button>

      {/* Pixel Art Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="floating-pixel"
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: i % 2 === 0 ? 'var(--green-neon)' : 'var(--text-white)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pixel-float-${i % 4} ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 10px currentColor'
            }}
          />
        ))}
      </div>
    </div>
  )
}
