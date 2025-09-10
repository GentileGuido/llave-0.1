"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCodeError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    // Obtener detalles del error de la URL
    const error = searchParams.get('error');
    if (error) {
      setErrorDetails(decodeURIComponent(error));
      console.log('Error de autenticación:', error);
    }

    // Extraer el token de la URL si existe
    const hash = window.location.hash;
    if (hash.includes('access_token=')) {
      // Hay un token, intentar procesarlo
      console.log('Token encontrado en URL:', hash);
      
      // Redirigir a la página principal para que procese el token
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [router, searchParams]);

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
            Error de Autenticación
          </h1>
          
          {errorDetails && (
            <div style={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              border: '1px solid var(--red-neon)', 
              borderRadius: '8px', 
              padding: '15px', 
              marginBottom: '20px',
              fontSize: '0.9rem',
              color: 'var(--red-neon)'
            }}>
              <strong>Detalles del error:</strong><br />
              {errorDetails}
            </div>
          )}
          
          <p className="pixel-subtitle" style={{ fontSize: '1rem', marginBottom: '20px' }}>
            Hubo un problema al iniciar sesión. Por favor, intenta nuevamente.
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
              VOLVER AL INICIO
            </button>
            
            <button
              onClick={() => window.location.reload()}
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