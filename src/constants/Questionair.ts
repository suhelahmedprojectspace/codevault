type QuestionsType='radio'|'checkbox'

interface MatchingQuestion{
    id:string;
    question:string;
    type:QuestionsType,
    options:string[];
    weight:number
}

export const matchingQuestions:MatchingQuestion[] = [
  {
    id: 'primaryLanguage',
    question: 'Which programming language do you use most frequently?',
    type: 'radio',
    options: [
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
    ],
    weight: 3
  },
  {
    id: 'techFocus',
    question: 'What area of development are you most interested in?',
    type: 'radio',
    options: [
      'Frontend (React, Vue, Angular)',
      'Backend (Node, Django, Spring)',
      'Mobile (iOS/Android)',
      'DevOps/Cloud',
      'Data Science/AI',
      'Game Development',
      'Embedded Systems',
      'Blockchain/Web3'
    ],
    weight: 2
  },
  {
    id: 'experienceLevel',
    question: 'How would you describe your coding experience level?',
    type: 'radio',
    options: [
      'Beginner (0-1 years)',
      'Intermediate (1-3 years)',
      'Advanced (3-5 years)',
      'Expert (5+ years)'
    ],
    weight: 1
  },
  {
    id: 'workSchedule',
    question: 'What best describes your preferred coding schedule?',
    type: 'radio',
    options: [
      'Early bird (morning focus)',
      'Standard 9-5 hours',
      'Night owl (evening focus)',
      'Flexible/irregular hours'
    ],
    weight: 3
  },
  {
    id: 'collabStyle',
    question: 'How do you prefer to collaborate on code?',
    type: 'radio',
    options: [
      'Pair programming (live together)',
      'Async code reviews',
      'Divide and conquer modules',
      'Mixed depending on task'
    ],
    weight: 2
  },
  {
    id: 'commsPreference',
    question: 'Your preferred communication method while coding?',
    type: 'radio',
    options: [
      'Text chat (Slack/Discord)',
      'Voice calls',
      'Video calls',
      'In-person when possible',
      'Mostly async (messages)'
    ],
    weight: 2
  },
  {
    id: 'projectGoals',
    question: 'What are your primary goals for pairing up? (Select all that apply)',
    type: 'checkbox',
    options: [
      'Learning new technologies',
      'Building portfolio projects',
      'Preparing for job interviews',
      'Open source contributions',
      'Startup/product development',
      'Competitive programming',
      'Just for fun'
    ],
    weight: 1
  },
  {
    id: 'feedbackStyle',
    question: 'How do you prefer to give/receive feedback on code?',
    type: 'radio',
    options: [
      'Direct and constructive',
      'Gentle suggestions',
      'Written comments only',
      'Through live discussion',
      'Prefer minimal feedback'
    ],
    weight: 2
  },
  {
    id: 'debuggingApproach',
    question: 'Your typical debugging strategy?',
    type: 'radio',
    options: [
      'Systematic breakpoints',
      'Console.log debugging',
      'Rubber duck explanation',
      'Stack overflow first',
      'Rewrite the code'
    ],
    weight: 1
  },
  {
    id: 'timeCommitment',
    question: 'How many hours weekly can you commit to pairing?',
    type: 'radio',
    options: [
      '1-5 hours',
      '5-10 hours',
      '10-15 hours',
      '15-20 hours',
      '20+ hours'
    ],
    weight: 3
  },
  {
    id: 'projectTypes',
    question: 'What types of projects interest you? (Select all that apply)',
    type: 'checkbox',
    options: [
      'Web applications',
      'Mobile apps',
      'CLI tools',
      'APIs/services',
      'Data visualization',
      'AI/ML projects',
      'Games',
      'Browser extensions',
      'DevOps automation'
    ],
    weight: 2
  },
  {
    id: 'learningStyle',
    question: 'How do you learn new concepts best?',
    type: 'radio',
    options: [
      'Video tutorials',
      'Documentation reading',
      'Hands-on experimentation',
      'Pair programming',
      'Online courses',
      'Books/guides'
    ],
    weight: 1
  },
  {
    id: 'conflictResolution',
    question: 'Your approach to technical disagreements?',
    type: 'radio',
    options: [
      'Discuss until consensus',
      'Research best practices',
      'Delegate decision',
      'Try both approaches',
      'Follow senior dev'
    ],
    weight: 2
  },
  {
    id: 'tools',
    question: 'Which tools do you regularly use? (Select all that apply)',
    type: 'checkbox',
    options: [
      'VS Code',
      'IntelliJ',
      'Vim/Neovim',
      'GitHub',
      'GitLab',
      'Docker',
      'Kubernetes',
      'JIRA',
      'Figma',
      'Postman'
    ],
    weight: 1
  },
  {
    id: 'personalityMatch',
    question: 'What personality traits do you value in a coding partner?',
    type: 'checkbox',
    options: [
      'Patient',
      'Fast-paced',
      'Detail-oriented',
      'Big-picture thinker',
      'Good communicator',
      'Highly technical',
      'Creative problem solver',
      'Structured/organized'
    ],
    weight: 2
  }
];

export type QuestionId = (typeof matchingQuestions)[number]['id'];