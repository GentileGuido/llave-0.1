"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="p-8 rounded-2xl shadow border w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4">LLAVE</h1>
        <p className="mb-6 opacity-80">Iniciá sesión para continuar</p>
        <button onClick={() => signIn("google")} className="px-4 py-2 rounded bg-black text-white">Entrar con Google</button>
      </div>
    </main>
  );
}
