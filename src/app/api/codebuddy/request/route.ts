import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
// import { onlineUsers,io } from '../../../../../server'


export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const { receiverId } = await req.json()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const existingRequest = await prisma.codeBuddyRequest.findUnique({
      where: {
        requesterId_receiverId: {
          requesterId: session.user.id,
          receiverId,
        },
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Request already exists' },
        { status: 400 }
      )
    }
    const userExists = await prisma.user.findUnique({
      where: { id: receiverId }
    });
    if (!userExists) throw new Error("Invalid receiver"); 

    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.codeBuddyRequest.create({
        data: {
          requesterId: session.user.id,
          receiverId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      })

      const notification = await tx.notification.create({
        data: {
          senderId: session.user.id,
          receiverId,
          codebuddyId: request.id,
          type: 'CONNECTION',
          status: 'PENDING',
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              image: true,
            },
          },
        },
      })
      return { request, notification }
    })
    
    // try {
    //      const channelName=`notifications-${receiverId}`
    //      const channel = ably.channels.get(channelName);
    //     await channel.publish("new-notification",{
    //       id:result.notification.id,
    //       message: `${result.notification.sender.username} sent you a buddy request.`,
    //       type: result.notification.type,
    //       isRead: false,
    //       createdAt: result.notification.createdAt,
    //       receiverId,
    //     });
    //     console.log("Notification sent via Ably",channel);
    // } catch (error) {
    //    console.error("Ably publish failed:", error);
    // }
   
    // const socketId=onlineUsers.get(receiverId);
    // if(socketId){
    //   io.to(socketId).emit('notification',{
    //     type:"CONNECTION",
    //      message: `${result.notification.sender.username} sent you a buddy request.`,
    //        sender: result.notification.sender,
    //     requestId: result.request.id,
    //   })
    // }

    //  return NextResponse.json(
    //   { message: "Buddy request sent" },
    //   { status: 201 }
    // );
 
    return NextResponse.json({message:"CodeBuddy REQUEST CREATED",result},{ status: 201 })
  } catch (error) {
    console.error('Error creating code buddy request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req:Request){
  try {
    const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unathorized" }, { status: 401 });
  }
  const user=await prisma.user.findUnique({
     where:{id:session.user.id}
  })
  const request=await prisma.codeBuddyRequest.findMany({
    where:{
        receiverId:user!.id,
        status:"PENDING"
    },
    include:{
        requester:{
            select:{
                image:true,
                email:true,
                username:true
            }
        }
    },
    orderBy:{
        createdAt:"desc"
    }
    
  })
  return NextResponse.json({message:"All request",request},{status:200})
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
  
}


export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, status } = await req.json();

    const request = await prisma.codeBuddyRequest.findFirst({
      where: { id: requestId, status: "PENDING" },
      include: {
        requester: true,
        reciever: true,
      },
    });

    if (!request) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (request.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to accept this request" }, { status: 403 });
    }

    if (status === "REJECTED") {
      await prisma.codeBuddyRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ message: "Buddy request rejected" }, { status: 200 });
    }
    const existingNotification = await prisma.notification.findFirst({
      where: {
        codebuddyId: request.receiverId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await prisma.$transaction([
      prisma.user.update({
        where: { id: request.requesterId },
        data: { codeBuddyId: request.receiverId },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { codeBuddyId: request.requesterId },
      }),
      prisma.codeBuddyRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      }),
      ...(existingNotification
        ? [
            prisma.notification.update({
              where: { id: existingNotification.id }, 
              data: { isRead: true },
            }),
          ]
        : []),
    ]);

    await prisma.notification.create({
      data: {
        senderId: session.user.id,
        receiverId: request.requesterId,
        codebuddyId: request.id,
        type: "CONNECTION",
        status: "APPROVED",
      },
    });

    return NextResponse.json(
      { message: "Buddy request accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accepting buddy request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
