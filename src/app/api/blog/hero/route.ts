import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    const blog = await prisma.blog.findMany({
      where: {
        visibilty: 'public',
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json({ message: 'Successfully fetched', blog }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
