import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const userId = (session as any).userId as string;

  // Get user's credentials
  const credentials = await prisma.webAuthnCredential.findMany({
    where: { userId }
  });

  if (credentials.length === 0) {
    return NextResponse.json({ error: 'no_credentials' }, { status: 404 });
  }

  const options = await generateAuthenticationOptions({
    rpID: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : 'localhost',
    allowCredentials: credentials.map(cred => ({
      id: Buffer.from(cred.id, 'base64url'),
      type: 'public-key',
      transports: (cred.transports?.split(',') as any) || ['internal'],
    })),
    userVerification: 'preferred',
  });

  // Store challenge
  await prisma.user.update({
    where: { id: userId },
    data: { name: options.challenge }
  });

  return NextResponse.json(options);
}
