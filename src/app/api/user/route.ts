import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sender: {
        select: { username: true, image: true },
      },
      snippet: {
        select: { title: true },
      },
      blog: {
        select: { title: true },
      },
    },
  });

  return Response.json(notifications);
}
