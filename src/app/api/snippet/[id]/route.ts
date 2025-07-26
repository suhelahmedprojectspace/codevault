import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(_req:Request,{params}: { params: Promise<{ id: string }>}) {
  const session = await getServerSession(authOptions);
  const { id } =await params
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const snippet = await prisma.snippet.findUnique({
    where: { id: id },
  });

  if (!snippet) {
    return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
  }

  if (snippet.authorid === session.user.id) {
    return NextResponse.json({ message: 'Snippet found', snippet }, { status: 200 });
  }

  return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}

export async function PUT(req: Request, {params}: { params: Promise<{ id: string }>}) {
  const session = await getServerSession(authOptions);
  const { id } =await params

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  const snippet = await prisma.snippet.findUnique({
    where: { id: id },
  });

  if (!snippet) {
    return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
  }

  const { title, content, description, framework, visibility } = await req.json();

  if (snippet.authorid === session.user.id) {
    const res = await prisma.snippet.update({
      where: { id: id },
      data: {
        title,
        content,
        description,
        framework,
        visibility,
      },
    });

    return NextResponse.json({ message: 'Snippet updated successfully', res }, { status: 200 });
  }

  return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}

export async function DELETE(_req:Request,{params}: { params: Promise<{ id: string }>}) {
  const session = await getServerSession(authOptions);
  const { id } =await params
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const snippet = await prisma.snippet.findUnique({
      where: {
        id: id,
      },
    });

    if (!snippet) {
      return NextResponse.json({ message: 'Snippet not found' }, { status: 404 });
    }

    if (snippet.authorid !== userId) {
      return NextResponse.json({ message: 'Forbidden: Not your snippet' }, { status: 403 });
    }

    const deletedSnippet = await prisma.snippet.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      { message: 'Snippet deleted successfully', deletedSnippet },
      { status: 200 },
    );
  } catch (error) {
    console.error('[DELETE_SNIPPET_ERROR]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
