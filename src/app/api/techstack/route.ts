import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const techStacks = await prisma.techStack.findMany();

    return NextResponse.json(
      {
        message: "Tech stack fetched successfully.",
        data: techStacks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching tech stack:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch tech stack.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
