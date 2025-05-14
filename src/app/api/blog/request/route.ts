import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unathorized" }, { status: 401 });
    }
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { blogId } = await req.json();
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    const alreadyRequest = await prisma.blogRequest.findFirst({
      where: { blogId, requesterId: currentUser.id },
    });
    if (alreadyRequest) {
      return NextResponse.json({ error: "Already requested" }, { status: 400 });
    }
    const request = await prisma.blogRequest.create({
      data: {
        blogId,
        requesterId: currentUser.id,
      },
    });
    const notification = await prisma.notification.create({
      data: {
        senderId: currentUser.id,
        receiverId: blog.authorId,
        blogId: blogId,
        type: "BLOG",
        status: "PENDING",
        isRead: false,
      },
    });
    return NextResponse.json({ request, notification }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unathorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const request = await prisma.blogRequest.findMany({
    where: {
      blog: {
        authorId: user!.id,
      },
      status: "PENDING",
    },
    include: {
      requester: true,
      blog: true,
    },
  });
  const notification = await prisma.notification.findMany({
    where: {
      receiverId: user!.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ request, notification });
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { requestId, status } = await req.json();
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    const request = await prisma.blogRequest.findUnique({
      where: { id: requestId },
      include: { blog: true },
    });
    console.log("this is request", request);
    if (!request || request.blog.authorId !== user!.id) {
      return NextResponse.json({ error: "Not authorized " }, { status: 403 });
    }
    const updateRequest = await prisma.blogRequest.update({
      where: { id: requestId },
      data: {
        status,
      },
    });

    await prisma.notification.updateMany({
      where: {
        blogId: request.blog.id,
        receiverId: user!.id,
        status: "PENDING",
      },
      data: {
        isRead: true,
      },
    });
    if (status === "APPROVED") {
      await prisma.blog.update({
        where: { id: request.blog.id },
        data: {
          allowedUsers: {
            connect: { id: request.requesterId },
          },
        },
      });
      await prisma.notification.create({
        data: {
          senderId: user!.id,
          receiverId: request.requesterId,
          blogId: request.blogId,
          type: "BLOG",
          status: "APPROVED",
        },
      });
    }
    return NextResponse.json(updateRequest);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
