import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const BlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  visibilty: z.enum(["private", "public"]),
  allowedUsers: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user?.email },
    });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    const parsed = BlogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { title, visibilty, content, allowedUsers } = parsed.data;
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        visibilty,
        author: {
          connect: { id: currentUser.id },
        },
        allowedUsers: allowedUsers
          ? {
              connect: allowedUsers.map((userId) => ({ id: userId })),
            }
          : undefined,
      },
    });
    return NextResponse.json(
      { message: "Blog created successfully", newBlog },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server error" },
      { status: 500 },
    );
  }
}
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        blog: true,
        allowedBlog: true,
      },
    });

    return NextResponse.json(
      { message: "Successfully fetched", user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
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
    const existingBlog = await prisma.blog.findUnique({
      where: { id: params.id },
    });
    if (!existingBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }
    if (existingBlog.authorId !== session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const { title, content, visibilty } = await req.json();

    const updateBlog = await prisma.blog.update({
      where: { id: params.id },
      data: {
        title,
        content,
        visibilty,
      },
    });
    return NextResponse.json(
      { message: "Snippet updated successfully", updateBlog },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Interna Server Error" },
      { status: 500 },
    );
  }
}
