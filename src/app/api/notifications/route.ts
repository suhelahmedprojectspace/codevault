import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const [snippetCount, blogCount,codeBuddyCount] = await Promise.all([
    prisma.notification.count({
      where: { receiverId: session.user.id, isRead: false, type: "SNIPPET" },
    }),
    prisma.notification.count({
      where: { receiverId: session.user.id, isRead: false, type: "BLOG" },
    }),
    prisma.notification.count({
      where:{  receiverId: session.user.id, 
        isRead: false, 
        type: "CONNECTION" }
    })
  ]);

  return NextResponse.json({ snippetCount, blogCount,codeBuddyCount });
}

export async function PUT() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.notification.updateMany({
    where: {
      receiverId: session.user.id,
      isRead: false,
    },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}
