"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { deriveKeyFromPass, encryptJson, decryptJson, randSalt } from "@/lib/crypto-client";

type VaultItem = {
  id: string;
  ciphertext: string;
  nonce: string;
  salt: string;
  updatedAt: string;
};

export default function VaultPage() {
  const [locked, setLocked] = useState(true);
  const [key, setKey] = useState<CryptoKey| null>(null);
  const [items, setItems] = useState<VaultItem[]>([]);
  const [plain, setPlain] = useState<any[]>([]);
  const [pass, setPass] = useState("");
  const timer = useRef<NodeJS.Timeout | null>(null);

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
    const res = await fetch("/api/vault", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setItems(data);
  }

  async function unlockWithPass() {
    const salt = randSalt(16); // solo para derivación inicial temporal
    const derived = await deriveKeyFromPass(pass, salt);
    setKey(derived);
    setLocked(false);
    // descifrar existentes
    const decoded:any[] = [];
    for (const it of items) {
      try {
        const obj = await decryptJson({ nonce: it.nonce, ciphertext: it.ciphertext }, derived);
        decoded.push({ id: it.id, ...obj });
      } catch {}
    }
    setPlain(decoded);
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
    const { nonce, ciphertext } = await encryptJson(obj, key);
    const salt = window.btoa(String.fromCharCode(...Array.from(randSalt(16))));
    const res = await fetch("/api/vault", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nonce, ciphertext, salt })
    });
    if (res.ok) { await fetchItems(); await refreshPlain( key ); }
  }

  async function refreshPlain(k: CryptoKey) {
    const res = await fetch("/api/vault", { cache: "no-store" });
    const data: VaultItem[] = await res.json();
    setItems(data);
    const decoded:any[] = [];
    for (const it of data) {
      try {
        const obj = await decryptJson({ nonce: it.nonce, ciphertext: it.ciphertext }, k);
        decoded.push({ id: it.id, ...obj });
      } catch {}
    }
    setPlain(decoded);
  }

  useEffect(() => { fetchItems(); }, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Cofre</h1>
        <div className="flex gap-2">
          {locked ? (
            <form onSubmit={(e) => { e.preventDefault(); unlockWithPass(); }}>
              <input className="border px-3 py-1 rounded mr-2" placeholder="Passphrase (fallback)" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
              <button className="px-3 py-1 rounded bg-black text-white">Desbloquear</button>
            </form>
          ) : (
            <button className="px-3 py-1 rounded border" onClick={()=>{ setKey(null); setLocked(true); setPlain([]); }}>Bloquear</button>
          )}
        </div>
      </div>

      {!locked && (
        <form className="grid gap-2 mb-6" onSubmit={(e)=>{e.preventDefault(); addItem(new FormData(e.currentTarget)); e.currentTarget.reset();}}>
          <input name="name" className="border px-3 py-2 rounded" placeholder="Nombre / Sitio" />
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
