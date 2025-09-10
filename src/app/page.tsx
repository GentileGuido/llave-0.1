"use client";

import React, { useState, useEffect } from "react";
import { supabase, signInWithGoogle, signOut } from '@/lib/supabase'
import { getPasswords, addPassword, updatePassword, deletePassword, Password } from '@/lib/supabase-passwords'
import { useRouter } from 'next/navigation'
import SplashScreen from "@/components/SplashScreen";
import DonationButton from "@/components/DonationButton";

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
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      setUser(user)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Process auth token from URL hash
  useEffect(() => {
    const processAuthToken = async () => {
      const hash = window.location.hash
      if (hash.includes('access_token=')) {
        console.log('🔍 Procesando token de autenticación desde URL')
        
        try {
          // Extraer el token del hash
          const urlParams = new URLSearchParams(hash.substring(1))
          const accessToken = urlParams.get('access_token')
          const refreshToken = urlParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            // Establecer la sesión manualmente
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (error) {
              console.error('❌ Error estableciendo sesión:', error)
            } else if (data.session) {
              console.log('✅ Sesión establecida exitosamente:', data.session.user?.email)
              setIsLoggedIn(true)
              setUser(data.session.user)
              
              // Limpiar la URL
              window.history.replaceState({}, document.title, window.location.pathname)
            }
          }
        } catch (error) {
          console.error('❌ Error procesando token:', error)
        }
      }
    }

    // Verificar si estamos procesando autenticación
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('auth_processing') === 'true') {
      processAuthToken()
      
      // Limpiar el parámetro de la URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('auth_processing')
      window.history.replaceState({}, document.title, newUrl.toString())
    }
  }, [])

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
      // Mostrar mensaje de error al usuario
      alert('Error al iniciar sesión. Verifica la configuración de Google OAuth.')
    }
  };

  const handleLogout = async () => {
    try {
      await signOut()
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error)
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      // Mostrar feedback visual (opcional)
      console.log('Contraseña copiada al portapapeles');
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleAddPassword = async () => {
    if (newSite && newPassword && user?.id) {
      console.log('➕ Agregando contraseña:', newSite)
      const newPasswordData = await addPassword(user.id, newSite, newPassword)
      
      if (newPasswordData) {
        setPasswords([...passwords, newPasswordData])
        console.log('✅ Contraseña agregada exitosamente')
      } else {
        console.error('❌ Error agregando contraseña')
        alert('Error al agregar la contraseña. Intenta nuevamente.')
      }
      
      setNewSite("");
      setNewPassword("");
      setShowAddModal(false);
    }
  };

  const handleEditPassword = (id: string) => {
    const password = passwords.find(p => p.id === id);
    if (password) {
      setEditSite(password.site);
      setEditPassword(password.password);
      setEditingId(id);
    }
  };

  const handleSaveEdit = async () => {
    if (editingId && editSite && editPassword) {
      console.log('✏️ Actualizando contraseña:', editingId)
      const updatedPassword = await updatePassword(editingId, editSite, editPassword)
      
      if (updatedPassword) {
        setPasswords(passwords.map(pwd => 
          pwd.id === editingId ? updatedPassword : pwd
        ));
        console.log('✅ Contraseña actualizada exitosamente')
      } else {
        console.error('❌ Error actualizando contraseña')
        alert('Error al actualizar la contraseña. Intenta nuevamente.')
      }
      
      setEditingId(null);
      setEditSite("");
      setEditPassword("");
    }
  };

  const handleDeletePassword = async (id: string) => {
    console.log('🗑️ Eliminando contraseña:', id)
    const success = await deletePassword(id)
    
    if (success) {
      setPasswords(passwords.filter(pwd => pwd.id !== id));
      console.log('✅ Contraseña eliminada exitosamente')
    } else {
      console.error('❌ Error eliminando contraseña')
      alert('Error al eliminar la contraseña. Intenta nuevamente.')
    }
    
    setDeletingId(null);
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
  };

  const handleDonation = async (type: string, amount: number) => {
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, amount }),
      });

      const data = await response.json();

      if (data.success && data.init_point) {
        // Redirigir a Mercado Pago
        window.location.href = data.init_point;
      } else {
        console.error('Error creating preference:', data.error);
        alert('Error al procesar la donación. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la donación. Intenta nuevamente.');
    }
  };

  // Android/Chromium install prompt support
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  }
  const installPromptRef = React.useRef<BeforeInstallPromptEvent | null>(null);

  // Listen for install prompt (usando el método de SOCIAL)
  useEffect(() => {
    const setFromGlobal = () => {
      const anyWindow = window as unknown as { __bipEvent?: BeforeInstallPromptEvent };
      if (anyWindow.__bipEvent) installPromptRef.current = anyWindow.__bipEvent;
    };
    setFromGlobal();
    window.addEventListener('bip-ready', setFromGlobal);
    return () => window.removeEventListener('bip-ready', setFromGlobal);
  }, []);

  const handleInstallAndroid = async () => {
    // Try global event first, then local ref (método de SOCIAL)
    const anyWindow = typeof window !== 'undefined' ? (window as unknown as { __bipEvent?: BeforeInstallPromptEvent }) : undefined;
    const promptEvent = anyWindow?.__bipEvent || installPromptRef.current;
    
    if (!promptEvent) {
      // Si no hay prompt, mostrar instrucciones
      console.log('No hay prompt disponible, mostrando instrucciones...');
      const isAndroid = /Android/i.test(navigator.userAgent);
      
      if (isAndroid) {
        alert('Para instalar en Android:\n\n1. Toca los tres puntos (⋮) en la barra de direcciones\n2. Selecciona "Instalar aplicación" o "Agregar a pantalla de inicio"\n3. Confirma la instalación\n\n¡La app se instalará como una aplicación nativa!');
      } else {
        alert('Para instalar en Android:\n\n1. Abre Chrome en tu dispositivo Android\n2. Ve a llaveapp.com\n3. Toca los tres puntos (⋮) en la barra de direcciones\n4. Selecciona "Instalar aplicación"\n5. Confirma la instalación');
      }
      return;
    }
    
    try {
      // Mostrar el prompt inmediatamente en respuesta al click
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ Usuario aceptó la instalación');
      } else {
        console.log('❌ Usuario rechazó la instalación');
      }
      
      // Limpiar el evento después de usarlo
      installPromptRef.current = null;
      if (anyWindow) anyWindow.__bipEvent = null;
    } catch (error) {
      console.error('Error durante la instalación:', error);
      alert('Error durante la instalación. Intenta usar el menú del navegador.');
    }
  };

  const handleInstallIOS = () => {
    // Detectar si es iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Mostrar instrucciones específicas para iOS
      alert('Para instalar en iOS:\n\n1. Toca el botón compartir (□↗) en Safari\n2. Selecciona "Agregar a pantalla de inicio"\n3. Personaliza el nombre si quieres\n4. Toca "Agregar"\n\n¡La app aparecerá en tu pantalla de inicio!');
    } else {
      // Mostrar instrucciones generales
      alert('Para instalar en iOS:\n\n1. Abre Safari en tu iPhone/iPad\n2. Ve a llaveapp.com\n3. Toca el botón compartir (□↗)\n4. Selecciona "Agregar a pantalla de inicio"\n5. Confirma y personaliza el nombre');
    }
  };

  const sortedPasswords = [...passwords].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.site.localeCompare(b.site);
      case "za":
        return b.site.localeCompare(a.site);
      case "recent":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
            className="pixel-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '1.2rem',
              padding: '15px 30px',
              backgroundColor: 'var(--green-neon)',
              borderColor: 'var(--green-neon)',
              color: 'var(--text-white)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              border: '2px solid var(--green-neon)',
              minWidth: '280px',
              margin: '0'
            }}
          >
            {/* Google Logo SVG */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
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
              zIndex: 10,
              fontSize: '24px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          
          <h1 className="pixel-title" style={{ 
            textAlign: 'center', 
            fontSize: '1.5rem',
            marginBottom: '20px'
          }}>Configuración</h1>
          
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
              <h4 className="pixel-subtitle">📱 Instalar en Android</h4>
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
              <h4 className="pixel-subtitle">🍎 Instalar en iOS</h4>
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

  // Main app content
  return (
    <div className="pixel-container">
      {/* Background Pixels */}
      <div className="background-pixels"></div>
      
      
      <div className="pixel-card pixel-fade-in">
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
            fontSize: 'clamp(0.6rem, 2.5vw, 0.8rem)' 
          }}>
            El gestor de contraseñas que necesitabas
          </p>
        </div>
        
        {/* Controls - Compact Two Rows */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          gap: 'clamp(6px, 2vw, 8px)', 
          margin: 'clamp(10px, 3vw, 15px) 0',
          alignItems: 'center'
        }}>
          {/* First Row */}
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(5px, 2vw, 10px)', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            <button
              onClick={() => setSortBy("recent")}
              className={`sort-button ${sortBy === "recent" ? "active" : ""}`}
              style={{ 
                fontSize: 'clamp(7px, 2.2vw, 9px)', 
                padding: 'clamp(4px, 1.2vw, 6px) clamp(6px, 2vw, 10px)',
                backgroundColor: sortBy === "recent" ? 'var(--green-neon)' : 'transparent',
                color: sortBy === "recent" ? 'black' : 'white'
              }}
            >
              Recientes
            </button>
            <button
              onClick={() => setSortBy("az")}
              className={`sort-button ${sortBy === "az" ? "active" : ""}`}
              style={{ 
                fontSize: 'clamp(7px, 2.2vw, 9px)', 
                padding: 'clamp(4px, 1.2vw, 6px) clamp(6px, 2vw, 10px)',
                backgroundColor: sortBy === "az" ? 'var(--green-neon)' : 'transparent',
                color: sortBy === "az" ? 'black' : 'white'
              }}
            >
              A / Z
            </button>
            <button
              onClick={() => setSortBy("za")}
              className={`sort-button ${sortBy === "za" ? "active" : ""}`}
              style={{ 
                fontSize: 'clamp(7px, 2.2vw, 9px)', 
                padding: 'clamp(4px, 1.2vw, 6px) clamp(6px, 2vw, 10px)',
                backgroundColor: sortBy === "za" ? 'var(--green-neon)' : 'transparent',
                color: sortBy === "za" ? 'black' : 'white'
              }}
            >
              Z / A
            </button>
          </div>
          
          {/* Second Row */}
          <div style={{ 
            display: 'flex', 
            gap: 'clamp(5px, 2vw, 10px)', 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            <button
              onClick={() => setShowAddModal(true)}
              className="pixel-button success"
              style={{ 
                fontSize: 'clamp(7px, 2.2vw, 9px)', 
                padding: 'clamp(4px, 1.2vw, 6px) clamp(6px, 2vw, 10px)' 
              }}
            >
              ➕ Agregar
            </button>
            <button
              onClick={() => setShowConfigScreen(true)}
              className="pixel-button"
              style={{ 
                fontSize: 'clamp(7px, 2.2vw, 9px)', 
                padding: 'clamp(4px, 1.2vw, 6px) clamp(6px, 2vw, 10px)' 
              }}
            >
              ℹ️ Info/Config
            </button>
          </div>
        </div>
        
        {/* Passwords List - Horizontal Cards */}
        <h3 className="pixel-subtitle" style={{ fontWeight: 'normal', color: 'white' }}>Tus Contraseñas</h3>
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
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="pixel-input"
                      style={{ margin: '0', fontSize: '12px' }}
                      placeholder="Contraseña"
                    />
                  </>
                ) : (
                  <>
                    <p className="password-title">{item.site}</p>
                    <p style={{ margin: '0', fontSize: '12px' }}>{visiblePasswords.has(item.id) ? item.password : "••••••••"}</p>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
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
                      className="icon-button copy"
                      onClick={() => copyPassword(item.password)}
                      title="Copiar contraseña"
                    >
                      📎
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
          <div className="pixel-card" style={{ overflow: 'visible', maxHeight: 'none' }}>
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
          <div className="pixel-card" style={{ overflow: 'visible', maxHeight: 'none' }}>
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
                type="text"
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

      {/* User Info and Logout - Centered at bottom */}
      {user && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '15px',
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          {/* User Info */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: 'rgba(0, 255, 65, 0.1)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--green-neon)'
          }}>
            {user.user_metadata?.avatar_url && (
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%',
                      border: '1px solid var(--green-neon)'
                    }} 
                  />
            )}
            <div>
              <p style={{ 
                margin: '0', 
                fontSize: '10px', 
                color: 'var(--green-neon)',
                fontWeight: 'bold'
              }}>
                {user.user_metadata?.full_name || user.email}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="pixel-button danger"
            style={{
              fontSize: '10px',
              padding: '8px 12px',
              minWidth: '80px'
            }}
            title="Cerrar sesión"
          >
            🚪 Salir
          </button>
        </div>
      )}
    </div>
  );
}
