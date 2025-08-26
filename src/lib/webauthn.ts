"use client";

import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export async function createPasskey(options: any) {
  try {
    const attResp = await startRegistration(options);
    return attResp;
  } catch (error) {
    console.error('Error creating passkey:', error);
    throw error;
  }
}

export async function getPasskey(options: any) {
  try {
    const authResp = await startAuthentication(options);
    return authResp;
  } catch (error) {
    console.error('Error getting passkey:', error);
    throw error;
  }
}
