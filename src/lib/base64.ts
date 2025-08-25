export const b64 = (u8: Uint8Array) => btoa(String.fromCharCode(...Array.from(u8)));
export const fromB64 = (s: string) =>
  new Uint8Array(Array.from(atob(s)).map(c => c.charCodeAt(0)));

export const b64urlToU8 = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
export const u8ToB64url = (u8: Uint8Array) =>
  btoa(String.fromCharCode(...Array.from(u8))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/,'');
