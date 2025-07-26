import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const { accountIDs } = await req.json();

    if (!Array.isArray(accountIDs)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: {
        userid: { in: accountIDs },
      },
      select: {
        id: true,
        links: true,
        title: true,
        name: true,
        profile: true,
        userid: true,
      },
    });

    return NextResponse.json({ portfolios }, { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
