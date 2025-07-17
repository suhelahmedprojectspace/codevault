import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
export async function GET(req:Request){
   try {
    const session= await getServerSession(authOptions);
    if(!session?.user.id){
         return NextResponse.json({ messaage: "Unathorised" }, { status: 401 });
    }
    const userWithBuddy=await prisma.user.findUnique({
        where:{id:session.user.id},
        include:{codeBuddy:true}
    })
    return NextResponse.json({message:"Successfully Fetched",userWithBuddy},{status:200});

   } catch (error) {
      console.error("Something went wrong at codebuddy:", error);
         return NextResponse.json(
           { message: "Internal Server Error" },
           { status: 500 },
         );
       }
   
}