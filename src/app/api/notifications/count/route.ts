import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type)
    return NextResponse.json({ error: "Missing type" }, { status: 400 });

  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: session.user.id,
      type,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notifications);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type)
    return NextResponse.json({ error: "Missing type" }, { status: 400 });

  await prisma.notification.updateMany({
    where: {
      receiverId: session.user.id,
      isRead: false,
      type,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
