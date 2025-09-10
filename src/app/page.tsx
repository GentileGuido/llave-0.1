"use client";

import React, { useState, useEffect } from "react";
import { supabase, signInWithGoogle, signOut } from '@/lib/supabase'
import { getPasswords, addPassword, updatePassword, deletePassword, Password } from '@/lib/supabase-passwords'
import { useRouter } from 'next/navigation'
import SplashScreen from "@/components/SplashScreen";
import DonationButton from "@/components/DonationButton";

// Define BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [passwordsLoaded, setPasswordsLoaded] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showConfigScreen, setShowConfigScreen] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newSite, setNewSite] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editSite, setEditSite] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Load passwords when user changes
  useEffect(() => {
    const loadPasswords = async () => {
      if (user?.id) {
        console.log('🔄 Cargando contraseñas para usuario:', user.id)
        const userPasswords = await getPasswords(user.id)
        setPasswords(userPasswords)
        setPasswordsLoaded(true)
        console.log('✅ Contraseñas cargadas:', userPasswords.length)
      } else {
        setPasswords([])
        setPasswordsLoaded(true)
      }
    }

    loadPasswords()
  }, [user])

  // Check user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('🔍 Checking session:', !!session)
        
        if (session?.user) {
          console.log('✅ Usuario encontrado:', session.user.email)
          setIsLoggedIn(true)
          setUser(session.user)
        } else {
          console.log('❌ No hay sesión activa')
          setIsLoggedIn(false)
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Error checking session:', error)
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, !!session)
      
      if (session?.user) {
        console.log('✅ Usuario logueado:', session.user.email)
        setIsLoggedIn(true)
        setUser(session.user)
      } else {
        console.log('❌ Usuario deslogueado')
        setIsLoggedIn(false)
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Process auth token from URL hash
  useEffect(() => {
    const processAuthToken = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const authProcessing = urlParams.get('auth_processing')
      
      if (authProcessing === 'true' && window.location.hash) {
        console.log('🔍 Processing auth token from URL hash')
        
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          try {
            console.log('🔑 Setting session with tokens')
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('❌ Error setting session:', error)
            } else {
              console.log('✅ Session set successfully')
              setIsLoggedIn(true)
              setUser(data.user)
            }
          } catch (error) {
            console.error('❌ Error processing auth token:', error)
          }
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      }
    }

    processAuthToken()
  }, [])

  const handleLogin = async () => {
    try {
      console.log('🔐 Iniciando login con Google...')
      await signInWithGoogle()
    } catch (error) {
      console.error('❌ Error en login:', error)
    }
  }

  const handleLogout = async () => {
    try {
      console.log('🚪 Cerrando sesión...')
      await signOut()
      setIsLoggedIn(false)
      setUser(null)
      setPasswords([])
      setPasswordsLoaded(false)
      console.log('✅ Sesión cerrada')
    } catch (error) {
      console.error('❌ Error en logout:', error)
    }
  }

  const handleAddPassword = async () => {
    if (newSite.trim() && newPassword.trim() && user?.id) {
      try {
        console.log('➕ Agregando nueva contraseña...')
        const newPasswordData = await addPassword(user.id, newSite.trim(), newPassword.trim())
        if (newPasswordData) {
          setPasswords(prev => [newPasswordData, ...prev])
          setNewSite("")
          setNewPassword("")
          setShowAddModal(false)
          console.log('✅ Contraseña agregada')
        } else {
          console.error('❌ Error: No se pudo crear la contraseña')
        }
      } catch (error) {
        console.error('❌ Error adding password:', error)
      }
    }
  }

  const handleSaveEdit = async () => {
    if (editingId && editSite.trim() && editPassword.trim()) {
      try {
        console.log('💾 Guardando edición...')
        const updatedPassword = await updatePassword(editingId, editSite.trim(), editPassword.trim())
        if (updatedPassword) {
          setPasswords(prev => prev.map(p => p.id === editingId ? updatedPassword : p))
          setEditingId(null)
          setEditSite("")
          setEditPassword("")
          console.log('✅ Contraseña actualizada')
        } else {
          console.error('❌ Error: No se pudo actualizar la contraseña')
        }
      } catch (error) {
        console.error('❌ Error updating password:', error)
      }
    }
  }

  const handleDeletePassword = async () => {
    if (deletingId) {
      try {
        console.log('🗑️ Eliminando contraseña...')
        await deletePassword(deletingId)
        setPasswords(prev => prev.filter(p => p.id !== deletingId))
        setDeletingId(null)
        console.log('✅ Contraseña eliminada')
      } catch (error) {
        console.error('❌ Error deleting password:', error)
      }
    }
  }

  const handleEditPassword = (password: Password) => {
    setEditingId(password.id)
    setEditSite(password.site)
    setEditPassword(password.password)
  }

  const copyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      console.log('📋 Contraseña copiada al portapapeles')
    } catch (error) {
      console.error('❌ Error copying password:', error)
    }
  }

  const togglePasswordVisibility = (passwordId: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(passwordId)) {
        newSet.delete(passwordId)
      } else {
        newSet.add(passwordId)
      }
      return newSet
    })
  }

  const sortedPasswords = [...passwords].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else if (sortBy === "alphabetical") {
      return a.site.localeCompare(b.site)
    } else if (sortBy === "reverse-alphabetical") {
      return b.site.localeCompare(a.site)
    } else {
      return a.site.localeCompare(b.site)
    }
  })

  const handleDonation = async (type: string) => {
    setSelectedDonation(type)
    
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.init_point) {
          window.open(data.init_point, '_blank')
        }
      } else {
        console.error('Error creating preference')
        setShowDonationModal(true)
      }
    } catch (error) {
      console.error('Error:', error)
      setShowDonationModal(true)
    }
  }

  // PWA Installation
  const [installPromptRef, setInstallPromptRef] = useState<any>(null)

  useEffect(() => {
    const setFromGlobal = () => {
      const anyWindow = typeof window !== 'undefined' ? (window as unknown as { __bipEvent?: BeforeInstallPromptEvent }) : undefined
      if (anyWindow?.__bipEvent) {
        setInstallPromptRef(anyWindow.__bipEvent)
      }
    }

    // Check if already available
    setFromGlobal()

    // Listen for the event
    window.addEventListener('bip-ready', setFromGlobal)

    return () => window.removeEventListener('bip-ready', setFromGlobal);
  }, []);

  const handleInstallAndroid = async () => {
    // Try global event first, then local ref (método de SOCIAL)
    const anyWindow = typeof window !== 'undefined' ? (window as unknown as { __bipEvent?: BeforeInstallPromptEvent }) : undefined
    const promptEvent = anyWindow?.__bipEvent || installPromptRef

    if (promptEvent) {
      try {
        const result = await promptEvent.prompt()
        console.log('Install prompt result:', result)
      } catch (error) {
        console.error('Error showing install prompt:', error)
        // Fallback to instructions
        alert(`Para instalar Llave en Android:

1. Abre Chrome o tu navegador
2. Ve a la página de Llave
3. Toca los tres puntos (⋮) en la esquina superior
4. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"
5. Confirma la instalación`)
      }
    } else {
      // Show instructions if no prompt available
      alert(`Para instalar Llave en Android:

1. Abre Chrome o tu navegador
2. Ve a la página de Llave
3. Toca los tres puntos (⋮) en la esquina superior
4. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"
5. Confirma la instalación`)
    }
  }

  const handleInstallIOS = () => {
    alert(`Para instalar Llave en iOS:

1. Abre Safari en tu iPhone/iPad
2. Ve a la página de Llave
3. Toca el botón compartir (📤)
4. Selecciona "Agregar a pantalla de inicio"
5. Confirma y personaliza el nombre`)
  }

  // Background animation
  useEffect(() => {
    const createPixel = () => {
      const pixel = document.createElement('div');
      pixel.className = 'floating-pixel';
      pixel.style.left = Math.random() * 100 + 'vw';
      pixel.style.animationDuration = Math.random() * 3 + 2 + 's';
      pixel.style.opacity = (Math.random() * 0.5 + 0.1).toString();
      
      const backgroundPixels = document.querySelector('.background-pixels');
      if (backgroundPixels) {
        backgroundPixels.appendChild(pixel);
        
        setTimeout(() => {
          if (pixel.parentNode) {
            pixel.parentNode.removeChild(pixel);
          }
        }, 5000);
      }
    };

    const interval = setInterval(createPixel, 1000);

    // Create initial pixels
    for (let i = 0; i < 5; i++) {
      setTimeout(createPixel, i * 500);
    }

    return () => clearInterval(interval);
  }, []);

  // Main app content
  return (
    <div className="pixel-container">
      {/* Background Pixels */}
      <div className="background-pixels"></div>
      
      {/* Show login screen if not logged in */}
      {!isLoggedIn && (
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
            className="pixel-button"
            style={{ 
              fontSize: '1.2rem', 
              padding: '15px 30px',
              animation: 'pixel-glow 2s ease-in-out infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            {/* Google Logo SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Iniciar Sesión con Google
          </button>
          
          <p className="pixel-subtitle" style={{ 
            margin: '20px 0 0 0', 
            fontSize: '1rem',
            textAlign: 'center'
          }}>
            🛡️ Seguridad pixelada garantizada 🛡️
          </p>
        </div>
      )}
      
      {/* Show main app content if logged in */}
      {isLoggedIn && (
        <div className="pixel-fade-in">
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px'
          }}>
            <h1 className="pixel-title" style={{ 
              margin: '0', 
              fontSize: 'clamp(1.2rem, 4vw, 2rem)' 
            }}>LLAVE</h1>
            <p className="pixel-subtitle" style={{ 
              margin: '5px 0 0 0', 
              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' 
            }}>
              🛡️ Seguridad pixelada garantizada 🛡️
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'clamp(8px, 2vw, 15px)', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="pixel-button success"
              style={{ 
                fontSize: 'clamp(10px, 2.5vw, 14px)',
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)'
              }}
            >
              ➕ Agregar
            </button>
            <button
              onClick={() => setShowConfigScreen(true)}
              className="pixel-button"
              style={{ 
                fontSize: 'clamp(10px, 2.5vw, 14px)',
                padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)'
              }}
            >
              ⚙️ Configuración
            </button>
          </div>

          {/* Sort Options */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'clamp(8px, 2vw, 10px)', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setSortBy("recent")}
              className={`pixel-button ${sortBy === "recent" ? "success" : ""}`}
              style={{ 
                fontSize: 'clamp(9px, 2vw, 12px)',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)'
              }}
            >
              🕒 Recientes
            </button>
            <button
              onClick={() => setSortBy("alphabetical")}
              className={`pixel-button ${sortBy === "alphabetical" ? "success" : ""}`}
              style={{ 
                fontSize: 'clamp(9px, 2vw, 12px)',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)'
              }}
            >
              🔤 A-Z
            </button>
            <button
              onClick={() => setSortBy("reverse-alphabetical")}
              className={`pixel-button ${sortBy === "reverse-alphabetical" ? "success" : ""}`}
              style={{ 
                fontSize: 'clamp(9px, 2vw, 12px)',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)'
              }}
            >
              🔤 Z-A
            </button>
          </div>

          {/* Passwords List */}
          {!passwordsLoaded ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ fontSize: '14px', color: 'var(--green-neon)' }}>
                🔄 Cargando contraseñas...
              </p>
            </div>
          ) : sortedPasswords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                📝 No hay contraseñas guardadas
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '10px' }}>
                Haz clic en &quot;➕ Agregar&quot; para crear tu primera contraseña
              </p>
            </div>
          ) : (
            <div className="pixel-grid">
              {sortedPasswords.map((password) => (
                <div key={password.id} className="pixel-card">
                  {editingId === password.id ? (
                    <div>
                      <input
                        type="text"
                        value={editSite}
                        onChange={(e) => setEditSite(e.target.value)}
                        className="pixel-input"
                        style={{ margin: '0 0 10px 0', fontSize: '12px' }}
                        placeholder="Sitio web"
                      />
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="pixel-input"
                        style={{ margin: '0', fontSize: '12px' }}
                        placeholder="Contraseña"
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '10px', 
                        marginTop: '15px'
                      }}>
                        <button
                          onClick={handleSaveEdit}
                          className="icon-button success"
                          style={{ fontSize: '16px' }}
                          title="Guardar cambios"
                        >
                          💾
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null)
                            setEditSite("")
                            setEditPassword("")
                          }}
                          className="icon-button"
                          style={{ fontSize: '16px' }}
                          title="Cancelar"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      width: '100%'
                    }}>
                      {/* Sección Izquierda - Datos */}
                      <div style={{ flex: 1 }}>
                        <h3 className="password-title" style={{ 
                          margin: '0 0 8px 0', 
                          fontSize: 'clamp(12px, 3vw, 16px)',
                          color: 'var(--blue-electric)'
                        }}>
                          {password.site}
                        </h3>
                        <div style={{ 
                          fontSize: 'clamp(10px, 2.5vw, 12px)', 
                          color: 'var(--text-white)',
                          wordBreak: 'break-all'
                        }}>
                          {visiblePasswords.has(password.id) ? password.password : "••••••••"}
                        </div>
                      </div>
                      
                      {/* Sección Derecha - Iconos */}
                      <div style={{ 
                        display: 'flex', 
                        gap: 'clamp(4px, 1vw, 8px)',
                        alignItems: 'center',
                        marginLeft: '15px'
                      }}>
                        <button
                          onClick={() => copyPassword(password.password)}
                          className="icon-button copy"
                          style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}
                          title="Copiar contraseña"
                        >
                          📎
                        </button>
                        <button
                          onClick={() => togglePasswordVisibility(password.id)}
                          className="icon-button"
                          style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}
                          title={visiblePasswords.has(password.id) ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {visiblePasswords.has(password.id) ? "🙈" : "👁️"}
                        </button>
                        <button
                          onClick={() => handleEditPassword(password)}
                          className="icon-button"
                          style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}
                          title="Editar contraseña"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeletingId(password.id)}
                          className="icon-button danger"
                          style={{ fontSize: 'clamp(12px, 3vw, 16px)' }}
                          title="Eliminar contraseña"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deletingId && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ overflow: 'visible', maxHeight: 'none' }}>
                <h3 className="pixel-subtitle">🗑️ Confirmar Eliminación</h3>
                <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '20px' }}>
                  ¿Estás seguro de que quieres eliminar esta contraseña?
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <button
                    onClick={handleDeletePassword}
                    className="pixel-button danger"
                  >
                    🗑️ Eliminar
                  </button>
                  <button
                    onClick={() => setDeletingId(null)}
                    className="pixel-button"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Password Modal */}
          {showAddModal && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ overflow: 'visible', maxHeight: 'none' }}>
                <h3 className="pixel-subtitle">➕ Nueva Contraseña</h3>
                <input
                  type="text"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  placeholder="Sitio web (ej: gmail.com)"
                  className="pixel-input"
                  style={{ marginBottom: '15px' }}
                />
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="pixel-input"
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                  <button
                    onClick={handleAddPassword}
                    className="pixel-button success"
                  >
                    ➕ Agregar
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      setNewSite("")
                      setNewPassword("")
                    }}
                    className="pixel-button"
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User info and logout */}
          {user && (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--green-neon)',
              fontSize: '12px',
              zIndex: 1000
            }}>
              <span style={{ color: 'var(--green-neon)' }}>
                {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="pixel-button"
                style={{
                  fontSize: '10px',
                  padding: '4px 8px',
                  minWidth: '80px'
                }}
                title="Cerrar sesión"
              >
                🚪 Salir
              </button>
            </div>
          )}

          {/* Show config screen if active */}
          {showConfigScreen && (
            <div className="pixel-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1000, background: 'rgba(0, 0, 0, 0.95)', overflowY: 'auto' }}>
              {/* Background Pixels */}
              <div className="background-pixels"></div>
              
              <div className="pixel-fade-in" style={{ maxWidth: '800px', margin: '20px auto', position: 'relative', paddingBottom: '50px' }}>
                {/* Back Button - Inside the main card */}
                <h1 className="pixel-title" style={{ 
                  textAlign: 'center', 
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  marginBottom: '20px'
                }}>Configuración</h1>
                
                {/* Back Button - Outside the card, top left */}
                <button 
                  className="back-button" 
                  onClick={() => setShowConfigScreen(false)}
                  style={{ 
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    fontSize: '18px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--purple-neon)',
                    border: '1px solid var(--purple-neon)',
                    color: 'var(--text-white)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10
                  }}
                >
                  ←
                </button>
                
                {/* App Info */}
                <div className="pixel-card">
                  <h4 className="pixel-subtitle">ℹ️ Acerca de Llave</h4>
                  <p style={{ fontSize: '12px', lineHeight: '2.4', marginBottom: '15px' }}>
                    Llave es un gestor de contraseñas seguro con estética pixel art. 
                    Desarrollado 100% con Inteligencia Artificial para ofrecer una experiencia 
                    única y retro.
                  </p>
                  <p style={{ fontSize: '12px', lineHeight: '2.4', marginBottom: '20px' }}>
                    Tecnologías: Next.js, TypeScript, CSS Pixel Art
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    lineHeight: '2.4', 
                    marginTop: '20px', 
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
                    <h4 className="pixel-subtitle">Instalar en Android</h4>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '12px', marginBottom: '15px', lineHeight: '1.8' }}>
                        Pasos para instalar:
                      </p>
                      <ol style={{ fontSize: '10px', textAlign: 'left', paddingLeft: '20px', lineHeight: '2.0' }}>
                        <li style={{ marginBottom: '8px' }}>Abre Chrome o tu navegador</li>
                        <li style={{ marginBottom: '8px' }}>Ve a la página de Llave</li>
                        <li style={{ marginBottom: '8px' }}>Toca los tres puntos de la esquina superior</li>
                        <li style={{ marginBottom: '8px' }}>Selecciona &quot;Instalar aplicación&quot;</li>
                        <li style={{ marginBottom: '8px' }}>Confirma la instalación</li>
                      </ol>
                    </div>
                    <div className="android-button" onClick={handleInstallAndroid} style={{ cursor: 'pointer' }}>
                      <div className="android-logo">🤖</div>
                      <span>Instalar App</span>
                    </div>
                  </div>
                  
                  <div className="pixel-card">
                    <h4 className="pixel-subtitle">Instalar en iOS</h4>
                    <div style={{ marginBottom: '20px' }}>
                      <p style={{ fontSize: '12px', marginBottom: '15px', lineHeight: '1.8' }}>
                        Pasos para instalar:
                      </p>
                      <ol style={{ fontSize: '10px', textAlign: 'left', paddingLeft: '20px', lineHeight: '2.0' }}>
                        <li style={{ marginBottom: '8px' }}>Abre Safari en tu iPhone/iPad</li>
                        <li style={{ marginBottom: '8px' }}>Ve a la página de Llave</li>
                        <li style={{ marginBottom: '8px' }}>Toca el botón compartir</li>
                        <li style={{ marginBottom: '8px' }}>Selecciona &quot;Agregar a pantalla de inicio&quot;</li>
                        <li style={{ marginBottom: '8px' }}>Confirma y personaliza el nombre</li>
                      </ol>
                    </div>
                    <p style={{ 
                      fontSize: '10px', 
                      textAlign: 'center', 
                      color: 'var(--blue-electric)',
                      marginTop: '15px',
                      fontStyle: 'italic'
                    }}>
                      Usa el botón compartir de Safari para agregar a inicio
                    </p>
                  </div>
                </div>

                {/* Donations */}
                <div className="pixel-card">
                  <h4 className="pixel-subtitle">💝 Donaciones</h4>
                  <p style={{ fontSize: '12px', marginBottom: '20px', textAlign: 'left', lineHeight: '2.0' }}>
                    Si te gusta Llave y quieres apoyar el desarrollo, considera hacer una donación:
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 'clamp(10px, 3vw, 15px)', 
                    flexWrap: 'wrap',
                    marginTop: '20px'
                  }}>
                    <DonationButton type="jugo" onDonate={handleDonation} />
                    <DonationButton type="pizza" onDonate={handleDonation} />
                    <DonationButton type="libro" onDonate={handleDonation} />
                    <DonationButton type="auto" onDonate={handleDonation} />
                  </div>
                </div>
              </div>

              {/* Donation Modal - Only show in config screen */}
              {showDonationModal && (
                <div className="modal-overlay">
                  <div className="modal-content" style={{ overflow: 'visible', maxHeight: 'none' }}>
                    <h3 className="pixel-subtitle">💝 Donación</h3>
                    <p style={{ fontSize: '12px', marginBottom: '20px', textAlign: 'left' }}>
                      ¿Estás seguro de que quieres hacer una donación de {selectedDonation}?
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                      <button
                        onClick={() => {
                          setShowDonationModal(false);
                          setSelectedDonation("");
                        }}
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
          )}
        </div>
      )}
    </div>
  );
}