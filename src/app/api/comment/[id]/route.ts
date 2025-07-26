import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkSession } from '@/lib/checkSession';
// import { z } from 'zod';

// const commentUpdateSchema = z.object({
//   id: z.string().cuid(),
//   content: z.string().min(2, 'Content must be at least 2 characters long'),
// });

export async function GET(_req:Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existBlog = await prisma.blog.findUnique({
      where: { id },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: { username: true, image: true },
            },
            replies: {
              include: {
                author: {
                  select: { username: true, image: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!existBlog) {
      return NextResponse.json({ message: 'Blog not Found' }, { status: 404 });
    }
    return NextResponse.json({ existBlog }, { status: 200 });
  } catch (error) {
    console.error('[GetBlog][API]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req:Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await checkSession();
    const { id } = await params;
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { blog: true },
    });
    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }
    if (comment.blog.authorId !== session.user?.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    await prisma.comment.delete({ where: { id } });
  } catch (error) {
    console.error('[DELETE Comment]', error);
    if ((error as any)?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
