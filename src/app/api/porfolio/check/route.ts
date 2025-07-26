import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // your next-auth config
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      portfolio: {
        select: {
          id: true,
        },
      },
      matchingPreferences: true,
    },
  });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const hasmatchingPreferences =
    user.matchingPreferences !== null &&
    user.matchingPreferences !== undefined &&
    Object.keys(user.matchingPreferences).length > 0;

  return NextResponse.json({
    hasPortfolio: !!user.portfolio,
    portfolioId: user.portfolio?.id,
    hasmatchingPreferences,
  });
}
