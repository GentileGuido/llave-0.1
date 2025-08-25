export interface VaultItem {
  id: string;
  userId: string;
  ciphertext: string;
  nonce: string;
  salt: string;
  updatedAt: string;
  createdAt: string;
}

export interface DecryptedVaultItem {
  id: string;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  note?: string;
}

export interface WebAuthnCredential {
  id: string;
  userId: string;
  publicKey: string;
  counter: number;
  transports?: string;
}
