import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const SaveSchema = z.object({
  ciphertext: z.string().min(1),
  nonce: z.string().min(1),
  salt: z.string().min(1),
});

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;

  const body = await req.json();
  const parsed = SaveSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const updated = await prisma.vaultItem.update({
    where: { id: params.id, userId },
    data: parsed.data
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string }}) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;

  await prisma.vaultItem.delete({ where: { id: params.id, userId } });
  return NextResponse.json({ ok: true });
}
