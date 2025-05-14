import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // Input validation
    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required." },
        { status: 400 },
      );
    }

    // Find and validate token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 },
      );
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete token after successful password reset
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/resetpassword error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
