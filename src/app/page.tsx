"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="pixel-container">
        <div className="pixel-card pixel-fade-in">
          <div className="character-grid">
            <div className="pac-man character-loading"></div>
            <div className="space-invader character-loading"></div>
            <div className="bomberman character-loading"></div>
          </div>
          <p className="pixel-subtitle">Cargando...</p>
        </div>
      </div>
    );
  }

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
        
        <h1 className="pixel-title">🔑 LLAVE</h1>
        <p className="pixel-subtitle">Gestor de Contraseñas Seguro</p>
        
        {/* Character Parade */}
        <div className="character-grid">
          <div className="character-with-label">
            <div className="pac-man character-interactive"></div>
            <div className="character-label">Pac-Man</div>
          </div>
          <div className="character-with-label">
            <div className="space-invader character-interactive"></div>
            <div className="character-label">Invader</div>
          </div>
          <div className="character-with-label">
            <div className="bomberman character-interactive"></div>
            <div className="character-label">Bomberman</div>
          </div>
          <div className="character-with-label">
            <div className="ghost character-interactive"></div>
            <div className="character-label">Ghost</div>
          </div>
          <div className="character-with-label">
            <div className="mario character-interactive"></div>
            <div className="character-label">Mario</div>
          </div>
        </div>
        
        {/* Status Section */}
        <div className="pixel-grid">
          <div className="pixel-card">
            <h3 className="pixel-subtitle">Estado del Sistema</h3>
            <p>✅ Railway: Conectado</p>
            <p>✅ Base de Datos: Activa</p>
            <p>✅ Autenticación: Configurada</p>
            <p>🎮 UI: Pixel Art Ready</p>
          </div>
          
          <div className="pixel-card">
            <h3 className="pixel-subtitle">Próximas Funciones</h3>
            <p>🔐 Crear contraseñas</p>
            <p>📝 Editar entradas</p>
            <p>🗑️ Eliminar datos</p>
            <p>📊 Ordenar por fecha</p>
            <p>📤 Exportar/Importar</p>
          </div>
        </div>
        
        {/* Authentication Section */}
        {session ? (
          <div className="pixel-card">
            <div className="character-grid">
              <div className="mario character-success"></div>
            </div>
            <p className="pixel-subtitle">
              👋 ¡Bienvenido, {session.user?.name || session.user?.email}!
            </p>
            <button
              onClick={() => signOut()}
              className="pixel-button danger"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="pixel-card">
            <div className="character-grid">
              <div className="ghost character-interactive"></div>
            </div>
            <p className="pixel-subtitle">Inicia sesión para continuar</p>
            <Link href="/auth/signin">
              <button className="pixel-button success">
                Iniciar Sesión
              </button>
            </Link>
          </div>
        )}
        
        {/* Footer */}
        <div className="pixel-card">
          <p className="pixel-subtitle">
            🕹️ {new Date().toLocaleString()} - Llave v0.1
          </p>
        </div>
      </div>
    </div>
  );
}
