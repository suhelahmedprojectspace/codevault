import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const SnippetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string(),
  framework: z.string(),
  visibility: z.enum(["private", "public"]),
  allowedUserIds: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("This is my session", session);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = SnippetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      content,
      visibility,
      allowedUserIds,
      framework,
    } = parsed.data;

    const newSnippet = await prisma.snippet.create({
      data: {
        title,
        description,
        content,
        visibility,
        framework,
        author: {
          connect: { id: currentUser.id },
        },
        allowedUsers: allowedUserIds
          ? {
              connect: allowedUserIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
    console.log(newSnippet);
    return NextResponse.json(
      { message: "Snippet created successfully", snippet: newSnippet },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        snippetCollection: true, // Snippets created by user
        allowedSnippets: true, // Snippets user has access to
      },
    });

    return NextResponse.json(
      { message: "Successfully fetched", user },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/snippet error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
