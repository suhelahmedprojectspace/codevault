import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(_req:Request,{params}: { params: Promise<{ id: string }>}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await prisma.notification.updateMany({
    where: { id: id, receiverId: session.user.id, isRead: false },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}
