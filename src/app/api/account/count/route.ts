import { checkSession } from "@/lib/checkSession";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await checkSession();

  try {
    const userStats = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            blog: true,
            snippetCollection: true,
            likes: true,
          },
        },
      },
    });

    const commentCount = await prisma.comment.count({
      where: { authorId: session.user.id },
    });

    return NextResponse.json({
      ...userStats,
      commentCount,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
