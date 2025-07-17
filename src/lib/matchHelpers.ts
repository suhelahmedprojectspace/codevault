import {User} from "@prisma/client"

export type MatchingPrefence={
  primaryLanguage?: string;
  techFocus?: string;
  experienceLevel?: string;
  workSchedule?: string;
  collabStyle?: string;
  projectGoals?: string[];
  tools?: string[];
}

const MATCH_WEIGHTS={
   TECHNICAL: 3,
  EXPERIENCE: 2,
  WORK_STYLE: 2,
  GOALS: 2.5,
  TOOLS: 1.
}

export function calculateCompatibility(userA:User,userB:User){
    
    const prefsA=userA.matchingPreferences as MatchingPrefence || {};
    const prefsB=userB.matchingPreferences as MatchingPrefence || {};

    let score=0;
    const matchDetails:string[]=[];
    const maxPossibleScore=Object.values(MATCH_WEIGHTS).reduce((a,b)=>a+b,0);

    if(prefsA.primaryLanguage === prefsB.primaryLanguage && prefsA.primaryLanguage){
        score+=MATCH_WEIGHTS.TECHNICAL * 0.5;
        matchDetails.push(`Both use: ${prefsA.primaryLanguage}`);
    }
    if(prefsA.techFocus===prefsB.techFocus && prefsA.techFocus){
       score+=MATCH_WEIGHTS.TECHNICAL *0.5;
        matchDetails.push(`Shared tech focus: ${prefsA.techFocus}`);
    }

    if(prefsA.experienceLevel && prefsB.experienceLevel){
        const levels=[
            'Beginner (0-1 years)',
            'Intermediate (1-3 years)',
            'Advanced (3-5 years)',
           'Expert (5+ years)'
        ];
    const diff=Math.abs(levels.indexOf(prefsA.experienceLevel)-levels.indexOf(prefsB.experienceLevel));
    const experienceScore = MATCH_WEIGHTS.EXPERIENCE * (1 - diff * 0.25)
    score+=Math.max(0,experienceScore); 

    if (diff === 0) {
      matchDetails.push(`Same experience level: ${prefsA.experienceLevel}`);
    }
    }

    if(prefsA.workSchedule===prefsB.workSchedule && prefsA.workSchedule){
        score+=MATCH_WEIGHTS.WORK_STYLE;
        matchDetails.push(`Matching schedule: ${prefsA.workSchedule}`);
    }
    if(prefsA.projectGoals && prefsB.projectGoals){
        const commonGoals=prefsA.projectGoals.filter(goal=>
            prefsB.projectGoals!.includes(goal));
        
        const matchRatio=commonGoals.length / Math.max(
            prefsA.projectGoals.length,
            prefsB.projectGoals.length
        )
       
        score+=matchRatio * MATCH_WEIGHTS.GOALS;
        if(commonGoals.length>0){
            matchDetails.push(`Shared goals: ${commonGoals.join(" ,")}`);
        }
    }
    if(prefsA.tools && prefsB.tools){
        const commonTools=prefsA.tools.filter(tools=>
            prefsB.tools!.includes(tools));
        
        const matchRatio=commonTools.length/Math.max(
            prefsA.tools.length,
            prefsB.tools.length
        )

        score+=matchRatio * MATCH_WEIGHTS.TOOLS;
        if(commonTools.length > 0){
             matchDetails.push(`Common tools: ${commonTools.join(", ")}`);
        }
    }
    const percentage=Math.min(100,Math.round((score/maxPossibleScore)*100));

    return {score,percentage,matchDetails}

}

export function filterEligibleUsers(currentUser: User, users: User[]) {
  return users.filter(user => {
    if( user.id === currentUser.id || user.codeBuddyId){
        return false;
    }

    const userPrefs=user.matchingPreferences as MatchingPrefence || {};
    const currentUserPrefs=currentUser.matchingPreferences as MatchingPrefence || {};

    const hasSomePreferences=(prefs:MatchingPrefence)=>{
        return (
          prefs.primaryLanguage ||
        prefs.techFocus ||
        prefs.experienceLevel ||
        prefs.workSchedule ||
        (prefs.projectGoals && prefs.projectGoals.length > 0) ||
        (prefs.tools && prefs.tools.length > 0)   
        );
    };
     return hasSomePreferences(userPrefs) && hasSomePreferences(currentUserPrefs);
  });
}
