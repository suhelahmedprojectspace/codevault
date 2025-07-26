import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const { content, senderId, recipientId } = await req.json();
    if (!content || !senderId || !recipientId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [sender, recipient] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: recipientId } }),
    ]);

    if (!sender || !recipient) {
      return NextResponse.json({ error: 'Sender or recipient not found' }, { status: 404 });
    }

    const response = await prisma.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
      },
    });
    await prisma.notification.create({
      data: {
        senderId,
        receiverId: recipientId,
        type: 'MESSAGE',
      },
    });
    return NextResponse.json({ message: 'Successfully Created', data: response }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId1 = searchParams.get('userId1');
    const userId2 = searchParams.get('userId2');
    const limit = Number(searchParams.get('limit')) || 50;
    const cursor = searchParams.get('cursor');

    if (!userId1 || !userId2) {
      return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId1,
            recipientId: userId2,
          },
          {
            senderId: userId2,
            recipientId: userId1,
          },
        ],
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        recipient: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: messages,
        nextCursor: messages.length === limit ? messages[messages.length - 1].id : null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
