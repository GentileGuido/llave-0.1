"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function VaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Cofre</h1>
        <div className="text-sm text-gray-600">
          Hola, {session?.user?.name || session?.user?.email}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">🚀 Deploy Exitoso!</h2>
        <p className="text-blue-700">
          La aplicación está funcionando correctamente en Railway. 
          Las funcionalidades de criptografía y WebAuthn se agregarán próximamente.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Funcionalidades Pendientes:</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Autenticación con Google</li>
            <li>⏳ Cifrado de contraseñas</li>
            <li>⏳ WebAuthn/Passkeys</li>
            <li>⏳ Base de datos</li>
            <li>⏳ Gestión de contraseñas</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
