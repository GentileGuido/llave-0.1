import { generateRegistrationOptions } from '@simplewebauthn/server';
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

  const options = await generateRegistrationOptions({
    rpName: 'LLAVE',
    rpID: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : 'localhost',
    userID: userId,
    userName: session.user?.email || userId,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  // Store challenge in session or temporary storage
  // For simplicity, we'll store it in the user record for now
  await prisma.user.update({
    where: { id: userId },
    data: { 
      // Store challenge temporarily - in production use Redis or similar
      name: options.challenge 
    }
  });

  return NextResponse.json(options);
}
