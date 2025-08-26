"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwords, setPasswords] = useState([
    { id: 1, site: "ejemplo.com", password: "ejemplo123", visible: false },
  ]);
  const [sortBy, setSortBy] = useState("recent");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showConfigScreen, setShowConfigScreen] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newSite, setNewSite] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editSite, setEditSite] = useState("");
  const [editPassword, setEditPassword] = useState("");

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

  const handleAddPassword = () => {
    if (newSite && newPassword) {
      const newId = Math.max(...passwords.map(p => p.id)) + 1;
      setPasswords([...passwords, { id: newId, site: newSite, password: newPassword, visible: false }]);
      setNewSite("");
      setNewPassword("");
      setShowAddModal(false);
    }
  };

  const handleEditPassword = (id: number) => {
    const password = passwords.find(p => p.id === id);
    if (password) {
      setEditSite(password.site);
      setEditPassword(password.password);
      setEditingId(id);
    }
  };

  const handleSaveEdit = () => {
    if (editingId && editSite && editPassword) {
      setPasswords(passwords.map(pwd => 
        pwd.id === editingId ? { ...pwd, site: editSite, password: editPassword } : pwd
      ));
      setEditingId(null);
      setEditSite("");
      setEditPassword("");
    }
  };

  const handleDeletePassword = (id: number) => {
    setPasswords(passwords.filter(pwd => pwd.id !== id));
    setDeletingId(null);
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
  };

  const handleDonation = (type: string) => {
    setSelectedDonation(type);
    setShowDonationModal(true);
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
      const sizes = ['tiny', 'small', 'medium', 'large', 'huge'];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = Math.random() > 0.5 ? 'white' : 'green';
      const animation = Math.floor(Math.random() * 5) + 1;
      
      // Variable speed based on size
      const speeds = {
        'tiny': [4, 6],
        'small': [6, 8],
        'medium': [8, 12],
        'large': [10, 15],
        'huge': [12, 18]
      };
      
      const speedRange = speeds[size as keyof typeof speeds];
      const speed = Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0];
      
      pixel.className = `floating-pixel ${color} ${size} pixel-float-${animation}`;
      pixel.style.animationDuration = `${speed}s`;
      
      // Add click event for explosion
      pixel.addEventListener('click', () => {
        pixel.classList.add('exploding');
        
        // Create explosion particles (divide into 2-4 based on size)
        const particleCount = size === 'tiny' ? 2 : size === 'small' ? 3 : size === 'medium' ? 4 : size === 'large' ? 5 : 6;
        
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = `floating-pixel ${color} tiny`;
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
          textAlign: 'center',
          gap: '30px'
        }}>
          <h1 className="pixel-title" style={{ margin: '0', fontSize: '3rem' }}>LLAVE</h1>
          <p className="pixel-subtitle" style={{ margin: '0', fontSize: '1.2rem' }}>El gestor de contraseñas que necesitabas</p>
          
          <button
            onClick={handleLogin}
            className="pixel-button success"
            style={{ margin: '0' }}
          >
            Iniciar Sesión
          </button>
          
          <p className="pixel-subtitle" style={{ margin: '0', fontSize: '1rem' }}>
            🛡️ Seguridad pixelada garantizada
          </p>
        </div>
      </div>
    );
  }

  // Show config screen if active
  if (showConfigScreen) {
    return (
      <div className="pixel-container">
        {/* Background Pixels */}
        <div className="background-pixels"></div>
        
        <div className="pixel-card pixel-fade-in" style={{ maxWidth: '800px', margin: '20px auto', position: 'relative' }}>
          {/* Back Button - Inside the main card */}
          <button 
            className="back-button" 
            onClick={() => setShowConfigScreen(false)}
            style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px',
              zIndex: 10
            }}
          >
            🔙
          </button>
          
          <h1 className="pixel-title">⚙️ Configuración</h1>
          
          {/* App Info */}
          <div className="pixel-card">
            <h4 className="pixel-subtitle">ℹ️ Acerca de Llave</h4>
            <p style={{ fontSize: '12px', lineHeight: '1.6' }}>
              Llave es un gestor de contraseñas seguro con estética pixel art. 
              Desarrollado 100% con Inteligencia Artificial para ofrecer una experiencia 
              única y retro.
            </p>
            <p style={{ fontSize: '12px', lineHeight: '1.6', marginTop: '10px' }}>
              Tecnologías: Next.js, TypeScript, CSS Pixel Art
            </p>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6', 
              marginTop: '15px', 
              color: 'var(--green-neon)',
              textAlign: 'center',
              animation: 'pixel-glow 2s ease-in-out infinite'
            }}>
              Desarrollador: Guido Gentile
            </p>
          </div>

          {/* Installation Instructions */}
          <div className="pixel-grid">
            <div className="pixel-card">
              <h4 className="pixel-subtitle">📱 Instalar en Android</h4>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                  Pasos para instalar:
                </p>
                <ol style={{ fontSize: '10px', textAlign: 'left', paddingLeft: '20px' }}>
                  <li>1. Abre Chrome o tu navegador</li>
                  <li>2. Ve a la página de Llave</li>
                  <li>3. Toca los tres puntos de la esquina superior</li>
                  <li>4. Selecciona "Instalar aplicación"</li>
                  <li>5. Confirma la instalación</li>
                </ol>
              </div>
              <div className="android-button">
                <div className="android-logo">🤖</div>
                <span>Instalar App</span>
              </div>
            </div>
            
            <div className="pixel-card">
              <h4 className="pixel-subtitle">🍎 Instalar en iOS</h4>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', marginBottom: '10px' }}>
                  Pasos para instalar:
                </p>
                <ol style={{ fontSize: '10px', textAlign: 'left', paddingLeft: '20px' }}>
                  <li>1. Abre Safari en tu iPhone/iPad</li>
                  <li>2. Ve a la página de Llave</li>
                  <li>3. Toca el botón compartir</li>
                  <li>4. Selecciona "Agregar a pantalla de inicio"</li>
                  <li>5. Confirma y personaliza el nombre</li>
                </ol>
              </div>
              <div className="android-button">
                <div className="android-logo">🍎</div>
                <span>Agregar a Inicio</span>
              </div>
            </div>
          </div>

          {/* Donations */}
          <div className="pixel-card">
            <h4 className="pixel-subtitle">💝 Donaciones</h4>
            <p style={{ fontSize: '12px', marginBottom: '15px', textAlign: 'left' }}>
              Si te gusta Llave y quieres apoyar el desarrollo, considera hacer una donación:
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleDonation('jugo')}
                className="pixel-button" 
                style={{ fontSize: '10px' }}
              >
                🧃 Jugo
              </button>
              <button 
                onClick={() => handleDonation('pizza')}
                className="pixel-button" 
                style={{ fontSize: '10px' }}
              >
                🍕 Pizza
              </button>
              <button 
                onClick={() => handleDonation('libro')}
                className="pixel-button" 
                style={{ fontSize: '10px' }}
              >
                📚 Libro
              </button>
              <button 
                onClick={() => handleDonation('auto')}
                className="pixel-button" 
                style={{ fontSize: '10px' }}
              >
                🚗 Auto
              </button>
            </div>
          </div>
        </div>

        {/* Donation Modal - Only show in config screen */}
        {showDonationModal && (
          <div className="modal-overlay">
            <div className="pixel-card">
              <h3 className="pixel-subtitle">💝 Donación - Mercado Pago</h3>
              <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '20px' }}>
                {selectedDonation === 'jugo' && '🧃 Jugo - $5.000'}
                {selectedDonation === 'pizza' && '🍕 Pizza - $10.000'}
                {selectedDonation === 'libro' && '📚 Libro - $15.000'}
                {selectedDonation === 'auto' && '🚗 Auto - $20.000'}
              </p>
              <p style={{ fontSize: '11px', textAlign: 'center', marginBottom: '20px' }}>
                Próximamente vincularemos con Mercado Pago para procesar tu donación.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="pixel-button success"
                >
                  ✅ Entendido
                </button>
                <button
                  onClick={() => setShowDonationModal(false)}
                  className="pixel-button"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pixel-container">
      {/* Background Pixels */}
      <div className="background-pixels"></div>
      
      <div className="pixel-card pixel-fade-in">
        {/* Header - Only Text */}
        <h1 className="pixel-title">LLAVE</h1>
        <p className="pixel-subtitle">El gestor de contraseñas que necesitabas</p>
        
        {/* Controls - Compact Two Rows */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          gap: '8px', 
          margin: '15px 0',
          alignItems: 'center'
        }}>
          {/* First Row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setSortBy("recent")}
              className={`sort-button ${sortBy === "recent" ? "active" : ""}`}
              style={{ fontSize: '9px', padding: '6px 10px' }}
            >
              Recientes
            </button>
            <button
              onClick={() => setSortBy("az")}
              className={`sort-button ${sortBy === "az" ? "active" : ""}`}
              style={{ fontSize: '9px', padding: '6px 10px' }}
            >
              A / Z
            </button>
            <button
              onClick={() => setSortBy("za")}
              className={`sort-button ${sortBy === "za" ? "active" : ""}`}
              style={{ fontSize: '9px', padding: '6px 10px' }}
            >
              Z / A
            </button>
          </div>
          
          {/* Second Row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="pixel-button success"
              style={{ fontSize: '9px', padding: '6px 10px' }}
            >
              ➕ Agregar
            </button>
            <button
              onClick={() => setShowConfigScreen(true)}
              className="pixel-button"
              style={{ fontSize: '9px', padding: '6px 10px' }}
            >
              ℹ️ Info/Config
            </button>
          </div>
        </div>
        
        {/* Passwords List - Horizontal Cards */}
        <h3 className="pixel-subtitle">Tus Contraseñas</h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          maxHeight: '60vh',
          overflowY: 'auto',
          transition: 'all 0.3s ease-in-out'
        }}>
          {sortedPasswords.map((item, index) => (
            <div key={item.id} className="pixel-card" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px',
              margin: '0',
              minHeight: '50px',
              animation: `slideInFromTop 0.5s ease-out ${index * 0.1}s both`
            }}>
              <div style={{ flex: 1 }}>
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editSite}
                      onChange={(e) => setEditSite(e.target.value)}
                      className="pixel-input"
                      style={{ margin: '0 0 5px 0', fontSize: '14px' }}
                      placeholder="Sitio"
                    />
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="pixel-input"
                      style={{ margin: '0', fontSize: '12px' }}
                      placeholder="Contraseña"
                    />
                  </>
                ) : (
                  <>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.site}</p>
                    <p style={{ margin: '0', fontSize: '12px' }}>{item.visible ? item.password : "••••••••"}</p>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                {editingId === item.id ? (
                  <button 
                    className="icon-button edit"
                    onClick={handleSaveEdit}
                    title="Guardar"
                  >
                    💾
                  </button>
                ) : (
                  <>
                    <button 
                      className="icon-button view"
                      onClick={() => togglePasswordVisibility(item.id)}
                      title="Ver contraseña"
                    >
                      👁️
                    </button>
                    <button 
                      className="icon-button edit"
                      onClick={() => handleEditPassword(item.id)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="icon-button delete"
                      onClick={() => confirmDelete(item.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="modal-overlay">
          <div className="pixel-card">
            <h3 className="pixel-subtitle">🗑️ Confirmar Eliminación</h3>
            <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '20px' }}>
              ¿Quieres eliminar esta contraseña?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={() => handleDeletePassword(deletingId)}
                className="pixel-button danger"
              >
                Eliminar
              </button>
              <button
                onClick={() => setDeletingId(null)}
                className="pixel-button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="pixel-card">
            <h3 className="pixel-subtitle">➕ Agregar Contraseña</h3>
            <div className="pixel-grid">
              <input
                type="text"
                value={newSite}
                onChange={(e) => setNewSite(e.target.value)}
                placeholder="Sitio/dominio/app"
                className="pixel-input"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Contraseña"
                className="pixel-input"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
              <button
                onClick={handleAddPassword}
                className="pixel-button success"
              >
                💾 Guardar
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSite("");
                  setNewPassword("");
                }}
                className="pixel-button danger"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
