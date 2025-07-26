import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const result = await prisma.snippet.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return NextResponse.json({ message: 'Fetch successfully', result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}
