import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId: session.user.id,
          blogId: params.id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ message: "Already liked" }, { status: 400 });
    }

    const res = await prisma.like.create({
      data: {
        userId: session.user.id,
        blogId: params.id,
      },
    });

    return NextResponse.json(
      { message: "Liked successfully", res },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Get like count
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const count = await prisma.like.count({
      where: { blogId: params.id },
    });

    return NextResponse.json(
      { count, message: "Liked count fetched" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Remove like
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.like.deleteMany({
      where: {
        blogId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Like removed" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
