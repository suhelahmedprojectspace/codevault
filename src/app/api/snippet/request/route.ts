import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unathorized' }, { status: 401 });
    }
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { snippetId } = await req.json();

    const snippets = await prisma.snippet.findUnique({
      where: { id: snippetId },
    });
    if (!snippets) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    const alreadyRequest = await prisma.snippetRequest.findFirst({
      where: { snippetId, requesterId: currentUser.id },
    });
    if (alreadyRequest) {
      return NextResponse.json({ error: 'Already requested' }, { status: 400 });
    }
    const request = await prisma.snippetRequest.create({
      data: {
        snippetId,
        requesterId: currentUser.id,
      },
    });
    const notification = await prisma.notification.create({
      data: {
        senderId: currentUser.id,
        receiverId: snippets.authorid,
        snippetId: snippetId,
        type: 'SNIPPET',
        status: 'PENDING',
        isRead: false,
      },
    });
    // const unreadNotification=await prisma.notification.count({
    //     where:{
    //         receiverId:snippets.authorid,
    //         isRead:false
    //     }
    // })
    return NextResponse.json({ request, notification }, { status: 201 });
  } catch (error) {
    console.log('/api/snippet/request', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unathorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const request = await prisma.snippetRequest.findMany({
    where: {
      snippet: {
        authorid: user!.id,
      },
      status: 'PENDING',
    },
    include: {
      requester: true,
      snippet: true,
    },
  });
  return NextResponse.json({ request });
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { requestId, status } = await req.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    const request = await prisma.snippetRequest.findUnique({
      where: { id: requestId },
      include: { snippet: true },
    });

    if (!request || request.snippet.authorid !== user!.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const updatedRequest = await prisma.snippetRequest.update({
      where: { id: requestId },
      data: {
        status,
      },
    });
    if (status === 'APPROVED') {
      await prisma.snippet.update({
        where: { id: request.snippetId },
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
          snippetId: request.snippetId,
          type: 'SNIPPET',
          status: 'APPROVED',
        },
      });
    }
    return NextResponse.json(updatedRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
