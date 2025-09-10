"use client";

import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { validateAuthConfig } from '@/lib/auth-config';

export default function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const gatherDebugInfo = async () => {
      // Validar configuración
      const configValidation = validateAuthConfig();
      
      // Verificar sesión actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Verificar si hay sesión activa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      setDebugInfo({
        configValidation,
        user: user ? { id: user.id, email: user.email } : null,
        userError: userError?.message || null,
        session: session ? { 
          access_token: session.access_token ? 'Presente' : 'Ausente',
          refresh_token: session.refresh_token ? 'Presente' : 'Ausente',
          expires_at: new Date(session.expires_at! * 1000).toLocaleString()
        } : null,
        sessionError: sessionError?.message || null,
        currentUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toLocaleString()
      });
    };

    gatherDebugInfo();
  }, []);

  const testGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error en test Google Auth:', error);
        alert(`Error: ${error.message}`);
      } else {
        console.log('Google Auth iniciado:', data);
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      alert(`Error inesperado: ${err}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="pixel-button"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontSize: '10px',
          padding: '8px 12px',
          backgroundColor: 'var(--purple-neon)',
          borderColor: 'var(--purple-neon)',
          color: 'var(--text-white)',
          zIndex: 1000
        }}
      >
        🐛 Debug Auth
      </button>
    );
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1001 }}>
      <div className="pixel-card" style={{ maxWidth: '800px', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="pixel-subtitle">🐛 Debug de Autenticación</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="pixel-button danger"
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Configuración */}
        <div className="pixel-card" style={{ marginBottom: '15px' }}>
          <h4 className="pixel-subtitle">📋 Configuración</h4>
          <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            <p><strong>Supabase URL:</strong> {debugInfo.configValidation?.isValid ? '✅ Configurado' : '❌ No configurado'}</p>
            <p><strong>Google OAuth:</strong> {debugInfo.configValidation?.hasGoogleConfig ? '✅ Configurado en servidor' : '❌ No configurado'}</p>
            {debugInfo.configValidation?.errors?.map((error: string, index: number) => (
              <p key={index} style={{ color: 'var(--red-neon)' }}>❌ {error}</p>
            ))}
          </div>
        </div>

        {/* Usuario actual */}
        <div className="pixel-card" style={{ marginBottom: '15px' }}>
          <h4 className="pixel-subtitle">👤 Usuario Actual</h4>
          <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            {debugInfo.user ? (
              <>
                <p><strong>ID:</strong> {debugInfo.user.id}</p>
                <p><strong>Email:</strong> {debugInfo.user.email}</p>
              </>
            ) : (
              <p style={{ color: 'var(--red-neon)' }}>❌ No hay usuario autenticado</p>
            )}
            {debugInfo.userError && (
              <p style={{ color: 'var(--red-neon)' }}>❌ Error: {debugInfo.userError}</p>
            )}
          </div>
        </div>

        {/* Sesión */}
        <div className="pixel-card" style={{ marginBottom: '15px' }}>
          <h4 className="pixel-subtitle">🔐 Sesión</h4>
          <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            {debugInfo.session ? (
              <>
                <p><strong>Access Token:</strong> {debugInfo.session.access_token}</p>
                <p><strong>Refresh Token:</strong> {debugInfo.session.refresh_token}</p>
                <p><strong>Expira:</strong> {debugInfo.session.expires_at}</p>
              </>
            ) : (
              <p style={{ color: 'var(--red-neon)' }}>❌ No hay sesión activa</p>
            )}
            {debugInfo.sessionError && (
              <p style={{ color: 'var(--red-neon)' }}>❌ Error: {debugInfo.sessionError}</p>
            )}
          </div>
        </div>

        {/* Información del navegador */}
        <div className="pixel-card" style={{ marginBottom: '15px' }}>
          <h4 className="pixel-subtitle">🌐 Navegador</h4>
          <div style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            <p><strong>URL actual:</strong> {debugInfo.currentUrl}</p>
            <p><strong>User Agent:</strong> {debugInfo.userAgent}</p>
            <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
          </div>
        </div>

        {/* Botones de prueba */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={testGoogleAuth}
            className="pixel-button success"
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            🔍 Probar Google Auth
          </button>
          <button
            onClick={() => {
              console.log('Debug Info:', debugInfo);
              alert('Información de debug copiada a la consola');
            }}
            className="pixel-button"
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            📋 Copiar a Consola
          </button>
        </div>
      </div>
    </div>
  );
}
