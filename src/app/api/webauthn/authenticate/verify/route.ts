import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const userId = (session as any).userId as string;
  const body = await req.json();

  try {
    // Get stored challenge
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.name) {
      return NextResponse.json({ error: 'no_challenge_found' }, { status: 400 });
    }

    // Get credential
    const credential = await prisma.webAuthnCredential.findUnique({
      where: { id: body.id }
    });

    if (!credential || credential.userId !== userId) {
      return NextResponse.json({ error: 'invalid_credential' }, { status: 400 });
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: user.name,
      expectedOrigin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      expectedRPID: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : 'localhost',
      authenticator: {
        credentialPublicKey: Buffer.from(credential.publicKey, 'base64'),
        credentialID: Buffer.from(credential.id, 'base64url'),
        counter: credential.counter,
      },
    });

    if (verification.verified) {
      // Update counter
      await prisma.webAuthnCredential.update({
        where: { id: credential.id },
        data: { counter: verification.authenticationInfo.newCounter }
      });

      // Clear challenge
      await prisma.user.update({
        where: { id: userId },
        data: { name: null }
      });

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ error: 'verification_failed' }, { status: 400 });
  } catch (error) {
    console.error('WebAuthn verification error:', error);
    return NextResponse.json({ error: 'verification_error' }, { status: 500 });
  }
}
