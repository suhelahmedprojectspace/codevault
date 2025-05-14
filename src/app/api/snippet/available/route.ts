import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parse } from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");
  const skip = (page - 1) * limit;
  try {
    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
          allowedUsers: {
            select: { id: true }, // Just return the IDs of allowed users
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.snippet.count(),
    ]);

    return NextResponse.json(
      { message: "All snippets fetched successfully", snippets, total },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching all snippets:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
