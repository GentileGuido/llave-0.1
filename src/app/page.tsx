"use client";

import { useState, useEffect } from "react";
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

  // Background pixels effect
  useEffect(() => {
    const createPixel = () => {
      const pixel = document.createElement('div');
      const sizes = ['small', 'medium', 'large'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = Math.random() > 0.5 ? 'white' : 'green';
      const animation = Math.floor(Math.random() * 5) + 1;
      
      pixel.className = `floating-pixel ${color} ${size} pixel-float-${animation}`;
      
      // Add click event for explosion
      pixel.addEventListener('click', () => {
        pixel.classList.add('exploding');
        
        // Create explosion particles
        for (let i = 0; i < 8; i++) {
          const particle = document.createElement('div');
          particle.className = `floating-pixel ${color} small`;
          particle.style.left = pixel.offsetLeft + 'px';
          particle.style.top = pixel.offsetTop + 'px';
          particle.style.animation = `pixel-explosion-${Math.floor(Math.random() * 4) + 1} 1s ease-out forwards`;
          document.querySelector('.background-pixels')?.appendChild(particle);
          
          setTimeout(() => particle.remove(), 1000);
        }
        
        setTimeout(() => pixel.remove(), 500);
      });
      
      document.querySelector('.background-pixels')?.appendChild(pixel);
      
      // Remove pixel after animation
      setTimeout(() => {
        if (pixel.parentNode) {
          pixel.remove();
        }
      }, 15000);
    };

    // Create pixels periodically
    const interval = setInterval(createPixel, 2000);
    
    // Create initial pixels
    for (let i = 0; i < 5; i++) {
      setTimeout(createPixel, i * 500);
    }

    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="pixel-container">
        {/* Background Pixels */}
        <div className="background-pixels"></div>
        
        <SplashScreen />
        
        {/* Login Screen - Only Button */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          textAlign: 'center'
        }}>
          <h1 className="pixel-title">LLAVE</h1>
          <p className="pixel-subtitle">El gestor de contraseñas que necesitabas</p>
          
          <button
            onClick={handleLogin}
            className="pixel-button success"
            style={{ marginTop: '40px' }}
          >
            Iniciar Sesión
          </button>
          
          <p className="pixel-subtitle" style={{ marginTop: '40px' }}>
            🛡️ Seguridad pixelada garantizada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-container">
      {/* Background Pixels */}
      <div className="background-pixels"></div>
      
      {/* Back Button */}
      <button className="back-button" onClick={handleLogout}>
        ←
      </button>
      
      {/* Theme Toggle */}
      <button className="theme-toggle">
        ⚙️
      </button>
      
      <div className="pixel-card pixel-fade-in">
        {/* Header - Only Text */}
        <h1 className="pixel-title">LLAVE</h1>
        <p className="pixel-subtitle">El gestor de contraseñas que necesitabas</p>
        
        {/* Controls - No Cards, Just Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          margin: '30px 0',
          flexWrap: 'wrap'
        }}>
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
          <button
            onClick={() => setShowAddModal(true)}
            className="pixel-button success"
          >
            ➕ Agregar
          </button>
        </div>
        
        {/* Passwords List - Horizontal Cards */}
        <h3 className="pixel-subtitle">Tus Contraseñas</h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {sortedPasswords.map((item) => (
            <div key={item.id} className="pixel-card" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '15px',
              margin: '0',
              minHeight: '60px'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Sitio: {item.site}</p>
                <p style={{ margin: '0', fontSize: '12px' }}>Contraseña: {item.visible ? item.password : "••••••••"}</p>
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
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
