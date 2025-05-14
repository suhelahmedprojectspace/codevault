import { transporter } from "./transporter";
import { PasswordResetToken } from "@prisma/client";
import prisma from "../prisma";
import crypto from "crypto";

export async function sendPasswordResetEmail(email: string) {
  const token = crypto.randomBytes(32).toString("hex");

  const expires = new Date(Date.now() + 1000 * 60 * 15);
  await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expiresAt: expires,
    },
  });
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"CodeVault Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
  return token;
}
