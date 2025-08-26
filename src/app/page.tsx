"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwords, setPasswords] = useState([
    { id: 1, site: "gmail.com", password: "mipassword123", visible: false },
    { id: 2, site: "facebook.com", password: "facebook2024", visible: false },
    { id: 3, site: "twitter.com", password: "twitterpass", visible: false },
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

  const togglePasswordVisibility = (id: number) => {
    setPasswords(passwords.map(pwd => 
      pwd.id === id ? { ...pwd, visible: !pwd.visible } : pwd
    ));
  };

  const sortedPasswords = [...passwords].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.site.localeCompare(b.site);
      case "za":
        return b.site.localeCompare(a.site);
      case "recent":
      default:
        return b.id - a.id;
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
              <div className="pixel-knight character-interactive"></div>
              <div className="character-label">Knight</div>
            </div>
            <div className="character-with-label">
              <div className="pixel-wizard character-interactive"></div>
              <div className="character-label">Wizard</div>
            </div>
            <div className="character-with-label">
              <div className="pixel-robot character-interactive"></div>
              <div className="character-label">Robot</div>
            </div>
            <div className="character-with-label">
              <div className="pixel-cat character-interactive"></div>
              <div className="character-label">Cat</div>
            </div>
          </div>
          
          {/* Login Section - Centered */}
          <div className="pixel-card" style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <div className="character-grid">
              <div className="pixel-knight character-interactive"></div>
            </div>
            <button
              onClick={handleLogin}
              className="pixel-button success"
            >
              Iniciar Sesión
            </button>
          </div>
          
          {/* Footer - No card */}
          <p className="pixel-subtitle" style={{ textAlign: 'center', marginTop: '20px' }}>
            🛡️ Seguridad pixelada garantizada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleLogout}>
        ←
      </button>
      
      {/* Theme Toggle */}
      <button className="theme-toggle">
        ⚙️
      </button>
      
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
        
        {/* Controls - Optimized */}
        <div className="pixel-grid">
          {/* Sort Controls */}
          <div className="pixel-card">
            <div className="character-grid">
              <button
                onClick={() => setSortBy("recent")}
                className={`sort-button ${sortBy === "recent" ? "active" : ""}`}
              >
                Recientes
              </button>
              <button
                onClick={() => setSortBy("az")}
                className={`sort-button ${sortBy === "az" ? "active" : ""}`}
              >
                A → Z
              </button>
              <button
                onClick={() => setSortBy("za")}
                className={`sort-button ${sortBy === "za" ? "active" : ""}`}
              >
                Z → A
              </button>
            </div>
          </div>
          
          {/* Add Button */}
          <div className="pixel-card">
            <div className="character-grid">
              <button
                onClick={() => setShowAddModal(true)}
                className="pixel-button success"
              >
                ➕ Agregar
              </button>
            </div>
          </div>
        </div>
        
        {/* Passwords List - Optimized */}
        <div className="pixel-card">
          <h3 className="pixel-subtitle">Tus Contraseñas</h3>
          <div className="pixel-grid">
            {sortedPasswords.map((item) => (
              <div key={item.id} className="pixel-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <p>Sitio: {item.site}</p>
                  <p>Contraseña: {item.visible ? item.password : "••••••••"}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="icon-button view"
                    onClick={() => togglePasswordVisibility(item.id)}
                    title="Ver contraseña"
                  >
                    👁️
                  </button>
                  <button 
                    className="icon-button edit"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    className="icon-button delete"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
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
