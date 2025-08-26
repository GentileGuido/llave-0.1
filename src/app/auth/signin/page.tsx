"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router]);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="pixel-container">
      <div className="pixel-card pixel-fade-in">
        {/* Header with Characters */}
        <div className="character-grid">
          <div className="character-with-label">
            <div className="space-invader character-large"></div>
            <div className="character-label">Llave</div>
          </div>
        </div>
        
        <h1 className="pixel-title">🔐 Iniciar Sesión</h1>
        <p className="pixel-subtitle">Accede a tu bóveda de contraseñas</p>
        
        {/* Character Animation */}
        <div className="character-grid">
          <div className="pac-man character-interactive"></div>
          <div className="ghost character-interactive"></div>
          <div className="mario character-interactive"></div>
        </div>
        
        {/* Sign In Button */}
        <div className="pixel-card">
          <button
            onClick={handleGoogleSignIn}
            className="pixel-button success"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              padding: '16px 32px'
            }}
          >
            <div className="space-invader character-small"></div>
            <span>Continuar con Google</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="pixel-card">
          <p className="pixel-subtitle">
            🕹️ Seguridad pixelada garantizada
          </p>
        </div>
      </div>
    </div>
  );
}
