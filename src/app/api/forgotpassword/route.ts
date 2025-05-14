import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mail/sendPasswordResetEmail";
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 },
      );
    }
    await sendPasswordResetEmail(email);

    return NextResponse.json({ message: "Reset email sent." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
