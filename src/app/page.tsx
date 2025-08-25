"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="p-8 rounded-2xl shadow border w-full max-w-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center">
      <div className="p-8 rounded-2xl shadow border w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">LLAVE</h1>
        <p className="opacity-80 mb-6">Gestor de contraseñas con cifrado de extremo a extremo y desbloqueo con biometría.</p>
        
        {session ? (
          <div className="space-y-4">
            <p className="text-sm opacity-70">Bienvenido, {session.user?.name || session.user?.email}</p>
            <div className="flex gap-2 justify-center">
              <Link href="/vault" className="px-4 py-2 rounded bg-black text-white inline-block">
                Ir al Cofre
              </Link>
              <button 
                onClick={() => signOut()} 
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 inline-block"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Link href="/signin" className="px-4 py-2 rounded bg-black text-white inline-block">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
