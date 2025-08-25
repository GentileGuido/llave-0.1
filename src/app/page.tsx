import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="p-8 rounded-2xl shadow border w-full max-w-lg text-center">
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">LLAVE</h1>
        <p className="opacity-80 mb-6">Gestor de contraseñas con cifrado de extremo a extremo y desbloqueo con biometría.</p>
        <Link href="/vault" className="px-4 py-2 rounded bg-black text-white inline-block">Ir al Cofre</Link>
      </div>
    </main>
  );
}
