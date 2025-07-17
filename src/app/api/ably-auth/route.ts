import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import Ably from 'ably';

export async function POST() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const client = new Ably.Rest(process.env.NEXT_PUBLIC_ABLY_KEY!);
  const tokenParams = { clientId: session.user.id };
  
  try {
    const tokenRequest = await client.auth.createTokenRequest(tokenParams);
    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Ably token request failed:", error);
    return NextResponse.json(
      { error: 'Failed to create token request' },
      { status: 500 }
    );
  }
}