import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user?.email) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    // }
    const response = await prisma.portfolio.findUnique({
      where: { id: params.id },
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
        { status: 403 },
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
