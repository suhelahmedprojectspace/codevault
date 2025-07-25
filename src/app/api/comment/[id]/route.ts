import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkSession } from "@/lib/checkSession";
import {z} from "zod"
 
const CommentSchema=z.object({
    content:z.string().min(2),
    blogId:z.string(),
    parentId:z.string().optional()
})

const commentUpdateSchema=z.object({
    id:z.string().cuid(),
    content:z.string().min(2,"Content must be at least 2 characters long")
})


export async function GET(req:Request,context:{params:{id:string}}){
    try {
        const {id}=context.params;
        const existBlog=await prisma.blog.findUnique({
            where:{id},
            include:{
                comments:{
                    where:{parentId:null},
                    include:{
                        author:{
                            select:{username:true,image:true}
                        },
                        replies:{
                            include:{
                                author:{
                                    select:{username:true,image:true}
                                }
                            }
                        }
                    },
                    orderBy:{createdAt:"desc"}
                }
            }
        })
        if(!existBlog){
            return NextResponse.json({message:"Blog not Found"},{status:404})
        }
       return NextResponse.json({ existBlog }, { status: 200 });
    } catch (error) {
       console.error("[GetBlog][API]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );  
    }
}

export async function DELETE(req:Request,context:{params:{id:string}}){
   try {
     const session=await checkSession();
     const {id}=context.params;
     const comment=await prisma.comment.findUnique({
        where:{id},
        include:{blog:true}
     })
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    if(comment.blog.authorId!==session.user?.id){
         return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await prisma.comment.delete({where:{id}});
   } catch (error) {
      console.error("[DELETE Comment]", error);
    if ((error as any)?.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
   }  
}



export async function PATCH(req:Request){
      try {
          const session= await checkSession();
          const result=commentUpdateSchema.safeParse(await req.json());
          if(!result.success){
             return NextResponse.json({message:"Invalid input",error:result.error.flatten()},{status:400})
          }
          const body=result.data;
          const existComment=await prisma.comment.findUnique({
            where:{id:body.id}
          })
          if(!existComment){
             return NextResponse.json({ message: "Comment not found" }, { status: 404 });
          }
         if(existComment.authorId!==session.user.id){
            return NextResponse.json({message:"Unauthorized"},{status:403});
         }
         const updateComment=await prisma.comment.update({
            where:{id:body.id},
            data:{
              content:body.content,
              updateAt:new Date()   
            }
         })
         return NextResponse.json({message:"Update successfully",updateComment},{status:200});
      } catch (error:any) {
         console.error("[update comment][API]",error);
         if(error.message==="UNAUTHORIZED"){
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
         }
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }
}