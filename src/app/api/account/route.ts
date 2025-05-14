import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import { unlink } from "fs/promises";
import path from "path";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";

const ProfileSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MINI_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

async function handleFileUpload(file: File | null, oldPath?: string) {
  if (!file) return undefined;
  if (!ALLOWED_MINI_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name);
  const filename = `${uuid()}${ext}`;

  const absoluteUploadPath = path.join(UPLOAD_DIR, filename);

  //file upload check
  if (!fs.existsSync(UPLOAD_DIR)) {
    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
  }
  await writeFile(absoluteUploadPath, buffer);

  if (oldPath) {
    const oldAbsolutePath = path.join(process.cwd(), "public", oldPath);
    //old file delete kar raha hai
    if (fs.existsSync(oldAbsolutePath)) {
      await unlink(oldAbsolutePath).catch(console.error);
    }
  }
  return `/uploads/${filename}`;
}
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ messaage: "Unathorised" }, { status: 403 });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    return NextResponse.json(
      { message: "Account Fetched", user },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ messaage: "Unathorised" }, { status: 401 });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const formData = await req.formData();

    const updateData: {
      username?: string;
      image?: string;
      password?: string;
    } = {};
    const file = formData.get("image") as File | null;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    if (username) {
      updateData.username = username;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const profilePath = file
      ? await handleFileUpload(file, existingUser.image || undefined)
      : undefined;
    if (profilePath) {
      updateData.image = profilePath;
    }
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        // Only return necessary fields
        id: true,
        username: true,
        email: true,
        image: true,
      },
    });
    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        image: true,
        portfolio: { select: { profile: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.notification.deleteMany({
        where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      });

      await tx.like.deleteMany({
        where: { userId: user.id },
      });

      await tx.snippetRequest.deleteMany({
        where: {
          OR: [{ snippetId: user.id }, { snippet: { authorid: user.id } }],
        },
      });

      await tx.blogRequest.deleteMany({
        where: {
          OR: [{ requesterId: user.id }, { blog: { authorId: user.id } }],
        },
      });

      if (user.portfolio?.profile) {
        const imagePath = path.join(
          process.cwd(),
          "public",
          user.portfolio.profile,
        );
        try {
          await unlink(imagePath);
        } catch (err) {
          console.error("Failed to delete portfolio image:", err);
        }
      }
      await tx.portfolio.deleteMany({
        where: { userid: user.id },
      });

      await tx.snippet.deleteMany({
        where: {
          OR: [
            { authorid: user.id },
            { allowedUsers: { some: { id: user.id } } },
          ],
        },
      });

      await tx.blog.deleteMany({
        where: {
          OR: [
            { authorId: user.id },
            { allowedUsers: { some: { id: user.id } } },
          ],
        },
      });

      await tx.account.deleteMany({
        where: { userId: user.id },
      });

      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json(
      { message: "Account and all associated data deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { message: "Failed to delete account" },
      { status: 500 },
    );
  }
}
