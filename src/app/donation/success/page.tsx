"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonationSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página principal después de 3 segundos
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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
          <h1 className="pixel-title" style={{ color: 'var(--green-neon)', fontSize: '2rem' }}>
            ✅ ¡Donación Exitosa!
          </h1>
          
          <p className="pixel-subtitle" style={{ fontSize: '1rem', marginBottom: '20px' }}>
            ¡Gracias por apoyar el desarrollo de Llave! Tu contribución nos ayuda a seguir mejorando la app.
          </p>
          
          <button
            onClick={() => router.push('/')}
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
              minWidth: '200px'
            }}
          >
            VOLVER A LLAVE
          </button>
        </div>
      </div>
    </div>
  );
}
