"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>
          🚀 ¡HOLA MUNDO!
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
          La aplicación funciona en Railway
        </p>
        
        {session ? (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              👋 Bienvenido, {session.user?.name || session.user?.email}!
            </p>
            <button
              onClick={() => signOut()}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <Link href="/auth/signin">
              <button style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Iniciar Sesión
              </button>
            </Link>
          </div>
        )}
        
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
