import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { calculateCompatibility,filterEligibleUsers } from "@/lib/matchHelpers";
interface MatchResult {
  userId: string;
  username: string;
  image: string | null;
  title?: string;
  links?: string[];
  portfolio?: {
    summary?: string;
    yearofexperience?: string;
    techstack?: any;
    location?: string;
  };
  score: number;
  percentage: number;
  matchDetails: string[];
}
const MatchingPrefenceSchema=z.object({
    primaryLanguage:z.enum([
    'JavaScript/TypeScript',
    'Python',
    'Java',
    'CPP',
    'C',
    'C#',
    'PHP',
    'Ruby',
    'Go',
    'Rust',
    'Swift',
    'Kotlin',
    'Other'
    ]),
    techFocus:z.enum([
         'Frontend (React, Vue, Angular)',
    'Backend (Node, Django, Spring)',
    'Mobile (iOS/Android)',
    'DevOps/Cloud',
    'Data Science/AI',
    'Game Development',
    'Embedded Systems',
    'Blockchain/Web3'
    ]),
    experienceLevel: z.enum([
    'Beginner (0-1 years)',
    'Intermediate (1-3 years)',
    'Advanced (3-5 years)',
    'Expert (5+ years)'
  ]),
  workSchedule: z.enum([
    'Early bird (morning focus)',
    'Standard 9-5 hours',
    'Night owl (evening focus)',
    'Flexible/irregular hours'
  ]),
  collabStyle: z.enum([
    'Pair programming (live together)',
    'Async code reviews',
    'Divide and conquer modules',
    'Mixed depending on task'
  ]),
  commsPreference:z.string(),
  projectGoals:z.array(z.string()),
  feedbackStyle:z.string(),
  debuggingApproach: z.string(),
  timeCommitment: z.string(),
  projectTypes: z.array(z.string()),
  learningStyle: z.string(),
  conflictResolution: z.string(),
  tools: z.array(z.string()),
  personalityMatch: z.array(z.string())
}).partial();
export async function PATCH(req:Request){
  try {
      const session=await getServerSession(authOptions);
      if(!session?.user.id){
        return NextResponse.json({message:"Unauthorized"},{status:403})
      }
      const existingUser=await prisma.user.findUnique({
        where:{id:session.user.id}
      })
      if(!existingUser){
        return NextResponse.json({message:"User not found"},{status:404});
      }

      const requestData=await req.json();
      const validation=MatchingPrefenceSchema.safeParse(requestData);
      if(!validation.success){
        return NextResponse.json({message:"Invalid preferences",errors:validation.error.errors},{status:400})
      }
      const updatedUser=await prisma.user.update({
        where:{id:session.user.id},
        data:{
            matchingPreferences:validation.data
        },
        select:{
            id:true,
            matchingPreferences:true
        }
      });
       return NextResponse.json(
      { 
        message: "Matching preferences updated successfully",
        preferences: updatedUser.matchingPreferences 
      },
      { status: 200 }
    );

  } catch (error) {
    console.log('Erron updating matching preferences ',error)
    return NextResponse.json(
        {message:"Internal server error"},
        {status:500}
    )
    
  }
}


export async function GET(req:Request){
  try {
     const session = await getServerSession(authOptions);
    
    if (!session?.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    const currentUser=await prisma.user.findUnique({
      where:{id:session.user.id},
      include:{
        portfolio:{
          include:{
            links:true}
            
        }
      }
    })
    if(!currentUser){
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allUsers = await prisma.user.findMany({});

    console.log('api/codebuddy',allUsers);
    const eligibleUser=filterEligibleUsers(currentUser,allUsers);
    console.log(`api/codebuddy/eligilible${eligibleUser}`)
    const matches=eligibleUser.map(user=>{
      const {score,percentage,matchDetails}=calculateCompatibility(currentUser,user);
      return{
        userId: user.id,
        username: user.username,
        image: user.image,    
        percentage,
       // portfolioId:user.portfolioId,
        score,
        matchDetails,
       
      }
    });
    
    const sortedMatches = matches.sort((a, b) => b.score - a.score);
     return NextResponse.json(
      { matches: sortedMatches.slice(0, 10) }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding matches:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  
  }
  
}


