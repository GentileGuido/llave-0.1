"use client";

import { useRouter } from 'next/navigation';

export default function DonationError() {
  const router = useRouter();

  return (
    <div className="pixel-container">
      <div className="background-pixels"></div>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        textAlign: 'center',
        gap: '30px'
      }}>
        <div className="pixel-card" style={{ maxWidth: '500px' }}>
          <h1 className="pixel-title" style={{ color: 'var(--red-neon)', fontSize: '2rem' }}>
            ❌ Error en la Donación
          </h1>
          
          <p className="pixel-subtitle" style={{ fontSize: '1rem', marginBottom: '20px' }}>
            Hubo un problema procesando tu donación. Por favor, intenta nuevamente.
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/')}
              className="pixel-button"
              style={{
                fontSize: '1rem',
                padding: '12px 24px',
                backgroundColor: 'var(--blue-neon)',
                borderColor: 'var(--blue-neon)',
                color: 'var(--text-white)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '8px',
                border: '2px solid var(--blue-neon)',
                minWidth: '150px'
              }}
            >
              VOLVER A LLAVE
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="pixel-button"
              style={{
                fontSize: '1rem',
                padding: '12px 24px',
                backgroundColor: 'var(--green-neon)',
                borderColor: 'var(--green-neon)',
                color: 'var(--text-white)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '8px',
                border: '2px solid var(--green-neon)',
                minWidth: '150px'
              }}
            >
              REINTENTAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
