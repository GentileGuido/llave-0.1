import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { prisma } from '@/utils/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
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

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: user.name,
      expectedOrigin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      expectedRPID: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : 'localhost',
    });

    if (verification.verified && verification.registrationInfo) {
      // Save credential
      await prisma.webAuthnCredential.create({
        data: {
          id: Buffer.from(verification.registrationInfo.credentialID).toString('base64url'),
          userId,
          publicKey: Buffer.from(verification.registrationInfo.credentialPublicKey).toString('base64'),
          counter: verification.registrationInfo.counter,
          transports: body.response.transports?.join(',') || null,
        }
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
