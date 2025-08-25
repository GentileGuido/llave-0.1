"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/vault");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="p-8 rounded-2xl shadow border w-full max-w-sm text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </main>
    );
  }

  if (session) {
    return null;
  }

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      const result = await signIn("google", { callbackUrl: "/vault" });
      if (result?.error) {
        setError("Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center">
      <div className="p-8 rounded-2xl shadow border w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">LLAVE</h1>
        <p className="mb-6 opacity-80">Iniciá sesión para continuar</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <button 
          onClick={handleSignIn}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50 w-full"
        >
          {loading ? "Cargando..." : "Entrar con Google"}
        </button>
        
        <p className="text-xs opacity-60 mt-4">
          Al continuar, aceptás nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </main>
  );
}
