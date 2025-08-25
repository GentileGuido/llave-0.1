"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deriveKeyFromPass, encryptJson, decryptJson, randSalt } from "@/lib/crypto-client";
import { createPasskey, getPasskey } from "@/lib/webauthn";
import { test } from "@/lib/test"; // Test import

type VaultItem = {
  id: string;
  ciphertext: string;
  nonce: string;
  salt: string;
  updatedAt: string;
};

export default function VaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [locked, setLocked] = useState(true);
  const [key, setKey] = useState<CryptoKey| null>(null);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [plain, setPlain] = useState<any[]>([]);
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Fetch items when session is available
  useEffect(() => { 
    if (session) {
      fetchItems(); 
    }
  }, [session]);

  // auto-lock por inactividad
  useEffect(() => {
    const touch = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setKey(null); setLocked(true); setPlain([]);
      }, 5 * 60 * 1000);
    };
    window.addEventListener("mousemove", touch);
    window.addEventListener("keydown", touch);
    touch();
    return () => {
      window.removeEventListener("mousemove", touch);
      window.removeEventListener("keydown", touch);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/vault", { cache: "no-store" });
      if (!res.ok) throw new Error("Error al cargar items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError("Error al cargar el cofre");
    }
  }

  async function unlockWithPass() {
    if (!pass.trim()) {
      setError("Ingresa una contraseña");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const salt = randSalt(16);
      const derived = await deriveKeyFromPass(pass, salt);
      setKey(derived);
      setLocked(false);
      
      // descifrar existentes
      const decoded: any[] = [];
      for (const it of items) {
        try {
          const obj = await decryptJson({ nonce: it.nonce, ciphertext: it.ciphertext }, derived);
          decoded.push({ id: it.id, ...obj });
        } catch {}
      }
      setPlain(decoded);
    } catch (err) {
      setError("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  }

  async function unlockWithWebAuthn() {
    setLoading(true);
    setError("");
    
    try {
      // Get authentication options
      const optionsRes = await fetch("/api/webauthn/authenticate/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!optionsRes.ok) throw new Error("Error al obtener opciones de autenticación");
      const options = await optionsRes.json();
      
      // Authenticate with passkey
      const authResp = await getPasskey(options);
      
      // Verify authentication
      const verifyRes = await fetch("/api/webauthn/authenticate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authResp)
      });
      
      if (!verifyRes.ok) throw new Error("Error en la verificación");
      
      const { key: derivedKey } = await verifyRes.json();
      // Convert base64 key back to CryptoKey
      const keyData = atob(derivedKey);
      const keyArray = new Uint8Array(keyData.length);
      for (let i = 0; i < keyData.length; i++) {
        keyArray[i] = keyData.charCodeAt(i);
      }
      
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyArray,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
      
      setKey(cryptoKey);
      setLocked(false);
      
      // Decrypt existing items
      const decoded: any[] = [];
      for (const it of items) {
        try {
          const obj = await decryptJson({ nonce: it.nonce, ciphertext: it.ciphertext }, cryptoKey);
          decoded.push({ id: it.id, ...obj });
        } catch {}
      }
      setPlain(decoded);
    } catch (err) {
      setError("Error con la autenticación biométrica");
    } finally {
      setLoading(false);
    }
  }

  async function addItem(formData: FormData) {
    if (!key) return;
    
    const obj = {
      name: String(formData.get("name") || ""),
      url: String(formData.get("url") || ""),
      username: String(formData.get("username") || ""),
      password: String(formData.get("password") || ""),
      note: String(formData.get("note") || "")
    };
    
    if (!obj.name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    
    try {
      const { nonce, ciphertext } = await encryptJson(obj, key);
      const salt = window.btoa(String.fromCharCode(...Array.from(randSalt(16))));
      
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, ciphertext, salt })
      });
      
      if (res.ok) { 
        await fetchItems(); 
        await refreshPlain(key);
        setError("");
      } else {
        setError("Error al guardar el item");
      }
    } catch (err) {
      setError("Error al guardar el item");
    }
  }

  async function refreshPlain(k: CryptoKey) {
    const res = await fetch("/api/vault", { cache: "no-store" });
    const data: VaultItem[] = await res.json();
    setItems(data);
    const decoded: any[] = [];
    for (const it of data) {
      try {
        const obj = await decryptJson({ nonce: it.nonce, ciphertext: it.ciphertext }, k);
        decoded.push({ id: it.id, ...obj });
      } catch {}
    }
    setPlain(decoded);
  }

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
        <div className="flex gap-2">
          {locked ? (
            <div className="flex gap-2">
              <button 
                onClick={unlockWithWebAuthn}
                disabled={loading}
                className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Passkey"}
              </button>
              <form onSubmit={(e) => { e.preventDefault(); unlockWithPass(); }}>
                <input 
                  className="border px-3 py-1 rounded mr-2" 
                  placeholder="Passphrase (fallback)" 
                  type="password" 
                  value={pass} 
                  onChange={e=>setPass(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
                  disabled={loading}
                >
                  Desbloquear
                </button>
              </form>
            </div>
          ) : (
            <button 
              className="px-3 py-1 rounded border" 
              onClick={()=>{ setKey(null); setLocked(true); setPlain([]); }}
            >
              Bloquear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!locked && (
        <form className="grid gap-2 mb-6" onSubmit={(e)=>{e.preventDefault(); addItem(new FormData(e.currentTarget)); e.currentTarget.reset();}}>
          <input name="name" className="border px-3 py-2 rounded" placeholder="Nombre / Sitio" required />
          <input name="url" className="border px-3 py-2 rounded" placeholder="URL" />
          <input name="username" className="border px-3 py-2 rounded" placeholder="Usuario" />
          <input name="password" className="border px-3 py-2 rounded" placeholder="Password" />
          <textarea name="note" className="border px-3 py-2 rounded" placeholder="Nota segura" />
          <button className="px-4 py-2 rounded bg-black text-white w-fit">Guardar</button>
        </form>
      )}

      <ul className="grid gap-3">
        {plain.map((p:any)=>(
          <li key={p.id} className="border rounded p-3">
            <div className="font-semibold">{p.name || "(sin nombre)"}</div>
            <div className="text-sm opacity-70">{p.url}</div>
            <div className="text-sm">Usuario: {p.username}</div>
            <div className="text-sm">Password: <span className="blur-sm hover:blur-none transition">{p.password}</span></div>
            {p.note && <p className="text-sm mt-1 opacity-80">{p.note}</p>}
          </li>
        ))}
      </ul>

      {locked && <p className="opacity-70 mt-6">Desbloqueá con Passkey o passphrase para ver tu cofre.</p>}
    </main>
  );
}
