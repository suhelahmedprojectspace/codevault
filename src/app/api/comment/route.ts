import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkSession } from '@/lib/checkSession';
import { z } from 'zod';

const CommentSchema = z.object({
  content: z.string().min(2),
  blogId: z.string(),
  parentId: z.string().optional(),
});

const commentUpdateSchema = z.object({
  id: z.string().cuid(),
  content: z.string().min(2, 'Content must be at least 2 characters long'),
});

export async function POST(req: Request) {
  try {
    const session = await checkSession();
    const json = await req.json();
    const result = CommentSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        { message: 'Validation Error', errors: result.error.flatten() },
        { status: 400 },
      );
    }
    const body = result.data;

    const existBlog = await prisma.blog.findUnique({
      where: { id: body.blogId },
    });
    if (!existBlog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    if (existBlog.authorId === session.user.id && !body.parentId) {
      return NextResponse.json(
        { message: 'Blog authors cannot comment on their own blog directly.' },
        { status: 403 },
      );
    }
    if (body.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: body.parentId },
        select: { parentId: true },
      });

      if (parentComment?.parentId) {
        return NextResponse.json(
          { message: 'Nested replies are limited to 1 level' },
          { status: 400 },
        );
      }
    }
    const newComment = await prisma.comment.create({
      data: {
        content: body.content,
        authorId: session.user.id,
        blogId: body.blogId,
        parentId: body.parentId ?? null,
      },
    });
    return NextResponse.json({ message: 'Successfully commented', newComment }, { status: 201 });
  } catch (error: any) {
    console.error('[CreateComment][API]', error);
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await checkSession();
    const result = commentUpdateSchema.safeParse(await req.json());
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', error: result.error.flatten() },
        { status: 400 },
      );
    }
    const body = result.data;
    const existComment = await prisma.comment.findUnique({
      where: { id: body.id },
    });
    if (!existComment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }
    if (existComment.authorId !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    const updateComment = await prisma.comment.update({
      where: { id: body.id },
      data: {
        content: body.content,
        updateAt: new Date(),
      },
    });
    return NextResponse.json({ message: 'Update successfully', updateComment }, { status: 200 });
  } catch (error: any) {
    console.error('[update comment][API]', error);
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
