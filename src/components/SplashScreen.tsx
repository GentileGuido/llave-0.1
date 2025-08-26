"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="llave-logo llave-logo-large"></div>
        <h1 className="splash-title">LLAVE</h1>
        <p className="splash-subtitle">El gestor de contraseñas que necesitabas</p>
      </div>
    </div>
  );
}
