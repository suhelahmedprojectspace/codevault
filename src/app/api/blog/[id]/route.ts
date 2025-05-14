import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const getBlog = await prisma.blog.findUnique({
      where: { id: params.id },
      include: {
        author: {
          include: {
            blog: {
              where: { NOT: { id: params.id } },
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    if (!getBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Successfully fetched", getBlog },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const getBlog = await prisma.blog.findUnique({
      where: { id: params.id },
    });
    if (!getBlog) {
      return NextResponse.json(
        { message: "Snippet not found" },
        { status: 404 },
      );
    }
    if (getBlog.authorId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const deletedBlog = await prisma.blog.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(
      { message: "deleted successfully", deletedBlog },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, content } = body;

    const existing = await prisma.blog.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.blog.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json({ message: "Updated", updated }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
