import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { z } from "zod";
import { NextResponse } from "next/server";
import { checkRate } from "@/utils/ratelimit";

export const runtime = "nodejs";

const SaveSchema = z.object({
  ciphertext: z.string().min(1),
  nonce: z.string().min(1),
  salt: z.string().min(1),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;

  const items = await prisma.vaultItem.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session as any).userId as string;

  const ip = (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  if (!checkRate(`${userId}:${ip}`)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const parsed = SaveSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const item = await prisma.vaultItem.create({
    data: { userId, ...parsed.data }
  });
  return NextResponse.json(item, { status: 201 });
}
