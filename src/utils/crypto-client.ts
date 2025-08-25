"use client";

import { fromB64, b64 } from "./base64";

export async function deriveKeyFromPass(pass: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", iterations: 310000, salt: salt as BufferSource },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJson(obj: any, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { nonce: b64(iv), ciphertext: b64(new Uint8Array(ct)) };
}

export async function decryptJson(payload: {nonce: string; ciphertext: string}, key: CryptoKey) {
  const iv = fromB64(payload.nonce);
  const ct = fromB64(payload.ciphertext);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}

export function randSalt(bytes = 16) {
  return crypto.getRandomValues(new Uint8Array(bytes));
}
