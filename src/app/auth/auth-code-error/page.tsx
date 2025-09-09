'use client'

import { useRouter } from 'next/navigation'

export default function AuthCodeError() {
  const router = useRouter()

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
      <div className="pixel-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h1 className="pixel-title" style={{ color: 'var(--red-neon)', fontSize: '2rem' }}>
          Error de Autenticación
        </h1>
        <p className="pixel-subtitle" style={{ margin: '20px 0', color: 'var(--text-white)' }}>
          Hubo un problema al iniciar sesión. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={() => router.push('/')}
          className="pixel-button"
          style={{
            fontSize: '1.1rem',
            padding: '12px 24px',
            backgroundColor: 'var(--blue-electric)',
            borderColor: 'var(--blue-electric)',
            color: 'var(--text-white)',
            cursor: 'pointer'
          }}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}
