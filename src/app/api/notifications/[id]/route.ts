import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.notification.updateMany({
    where: { id: params.id, receiverId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}
