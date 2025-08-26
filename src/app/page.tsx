"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwords, setPasswords] = useState([
    { id: 1, site: "gmail.com", password: "********", date: "2024-01-15" },
    { id: 2, site: "facebook.com", password: "********", date: "2024-01-10" },
    { id: 3, site: "twitter.com", password: "********", date: "2024-01-05" },
  ]);
  const [sortBy, setSortBy] = useState("recent");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const sortedPasswords = [...passwords].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.site.localeCompare(b.site);
      case "za":
        return b.site.localeCompare(a.site);
      case "recent":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  if (!isLoggedIn) {
    return (
      <div className="pixel-container">
        <SplashScreen />
        <div className="pixel-card pixel-fade-in">
          {/* Header with Logo */}
          <div className="character-grid">
            <div className="character-with-label">
              <div className="llave-logo"></div>
              <div className="character-label">Llave</div>
            </div>
          </div>
          
          <h1 className="pixel-title">🔑 LLAVE</h1>
          <p className="pixel-subtitle">El gestor de contraseñas que necesitabas</p>
          
          {/* Character Parade */}
          <div className="character-grid">
            <div className="character-with-label">
              <div className="lemming character-interactive"></div>
              <div className="character-label">Lemming</div>
            </div>
            <div className="character-with-label">
              <div className="lemming-female character-interactive"></div>
              <div className="character-label">Lemming F</div>
            </div>
            <div className="character-with-label">
              <div className="dog character-interactive"></div>
              <div className="character-label">Perrito</div>
            </div>
          </div>
          
          {/* Login Section */}
          <div className="pixel-card">
            <div className="character-grid">
              <div className="lemming character-interactive"></div>
            </div>
            <p className="pixel-subtitle">🔐 Inicia sesión para acceder a tus contraseñas</p>
            <button
              onClick={handleLogin}
              className="pixel-button success"
            >
              Iniciar Sesión
            </button>
          </div>
          
          {/* Footer */}
          <div className="pixel-card">
            <p className="pixel-subtitle">
              🛡️ Seguridad pixelada garantizada
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-container">
      <div className="pixel-card pixel-fade-in">
        {/* Header */}
        <div className="character-grid">
          <div className="character-with-label">
            <div className="llave-logo"></div>
            <div className="character-label">Llave</div>
          </div>
        </div>
        
        <h1 className="pixel-title">🔑 LLAVE</h1>
        <p className="pixel-subtitle">El gestor de contraseñas que necesitabas</p>
        
        {/* Controls */}
        <div className="pixel-grid">
          <div className="pixel-card">
            <h3 className="pixel-subtitle">Ordenar por:</h3>
            <div className="character-grid">
              <button
                onClick={() => setSortBy("recent")}
                className={`pixel-button ${sortBy === "recent" ? "success" : ""}`}
              >
                Recientes
              </button>
              <button
                onClick={() => setSortBy("az")}
                className={`pixel-button ${sortBy === "az" ? "success" : ""}`}
              >
                A → Z
              </button>
              <button
                onClick={() => setSortBy("za")}
                className={`pixel-button ${sortBy === "za" ? "success" : ""}`}
              >
                Z → A
              </button>
            </div>
          </div>
          
          <div className="pixel-card">
            <h3 className="pixel-subtitle">Acciones:</h3>
            <div className="character-grid">
              <button
                onClick={() => setShowAddModal(true)}
                className="pixel-button success"
              >
                ➕ Agregar
              </button>
              <button
                onClick={() => setShowConfig(true)}
                className="pixel-button"
              >
                ⚙️ Config
              </button>
              <button
                onClick={handleLogout}
                className="pixel-button danger"
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </div>
        
        {/* Passwords List */}
        <div className="pixel-card">
          <h3 className="pixel-subtitle">Tus Contraseñas</h3>
          <div className="pixel-grid">
            {sortedPasswords.map((item) => (
              <div key={item.id} className="pixel-card">
                <div className="character-grid">
                  <div className="lemming character-small"></div>
                </div>
                <p><strong>Sitio:</strong> {item.site}</p>
                <p><strong>Contraseña:</strong> {item.password}</p>
                <p><strong>Fecha:</strong> {item.date}</p>
                <div className="character-grid">
                  <button className="pixel-button">✏️ Editar</button>
                  <button className="pixel-button danger">🗑️ Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="pixel-card">
            <h3 className="pixel-subtitle">➕ Agregar Contraseña</h3>
            <div className="pixel-grid">
              <input
                type="text"
                placeholder="Sitio/dominio/app"
                className="pixel-input"
              />
              <input
                type="password"
                placeholder="Contraseña"
                className="pixel-input"
              />
            </div>
            <div className="character-grid">
              <button
                onClick={() => setShowAddModal(false)}
                className="pixel-button success"
              >
                💾 Guardar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="pixel-button danger"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Config Modal */}
      {showConfig && (
        <div className="modal-overlay">
          <div className="pixel-card">
            <h3 className="pixel-subtitle">⚙️ Configuración</h3>
            <div className="pixel-grid">
              <div className="pixel-card">
                <h4 className="pixel-subtitle">📱 Instalar en Android</h4>
                <div className="android-button">
                  <div className="android-logo">A</div>
                  <span>Instalar App</span>
                </div>
              </div>
              <div className="pixel-card">
                <h4 className="pixel-subtitle">📱 Instalar en iOS</h4>
                <p>Agregar a pantalla de inicio</p>
              </div>
            </div>
            <div className="pixel-card">
              <h4 className="pixel-subtitle">ℹ️ Acerca de Llave</h4>
              <p>Llave es un gestor de contraseñas seguro con estética pixel art.</p>
              <p>Desarrollado con Next.js, TypeScript y mucho amor por los videojuegos retro.</p>
            </div>
            <button
              onClick={() => setShowConfig(false)}
              className="pixel-button"
            >
              ✅ Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
