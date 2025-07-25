import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
   context: { params: Promise<{ id: string }> },
) {
  try {
    const {id}= await context.params;
    const response = await prisma.portfolio.findUnique({
      where: { id },
      include: {
        links: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    if (!response) {
      return NextResponse.json(
        { message: "Portfolio not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Successfully fetched", response },
      { status: 200 },
    );
  } catch (error) {
    console.error("Portfolio fetching  error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
