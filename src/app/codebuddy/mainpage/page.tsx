'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Sparkles, Users, Search, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

export default function CodeBuddyIntroPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Search className="h-6 w-6 text-blue-500" />,
      title: 'Smart Matching',
      description:
        'Our algorithm pairs you with ideal coding partners based on skill level, tech stack, and learning goals.',
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: 'Collaborative Learning',
      description:
        'Work on real projects together with shared environments and version control integration.',
    },
    {
      icon: <Code className="h-6 w-6 text-blue-500" />,
      title: 'Code Together',
      description: 'Real-time pair programming with built-in video chat and code synchronization.',
    },
    // {
    //   icon: <GitBranch className="h-6 w-6 text-blue-500" />,
    //   title: "Project Management",
    //   description: "Track joint projects with integrated Git workflows and task delegation."
    // },
    {
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      title: 'Skill Validation',
      description: 'Earn verifiable badges by completing challenges with your buddy.',
    },
    // {
    //   icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
    //   title: "Safe Environment",
    //   description: "All members are verified developers with skill assessments."
    // }
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Pair Program</span> with Your Perfect{' '}
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <TypeAnimation
                sequence={['Dev Match', 1500, 'Code Partner', 1500, 'Tech Buddy', 1500]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-blue-600"
              />
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Connect with developers who match your stack, skill level, and learning objectives.
              Grow faster through collaborative coding and peer accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => router.push('/onboarding')}
              >
                Find My Coding Buddy
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg"
                onClick={() => router.push('/demo')}
              >
                See How It Works
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border-1 border-black p-8 md:p-12 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CodeBuddy Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Three simple steps to find your ideal coding partner and start growing together
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Profile"
              description="Tell us about your skills, goals, and preferences"
            />
            <StepCard
              number="2"
              title="Get Matched"
              description="Receive curated buddy suggestions daily"
            />
            <StepCard
              number="3"
              title="Start Coding"
              description="Collaborate using our built-in tools"
            />
          </div>
        </section>
      </main>

      {/* <footer className="bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Join 10,000+ developers accelerating their growth with CodeBuddy</p>
          <div className="flex justify-center gap-6 mt-6">
            <Button variant="ghost">Terms</Button>
            <Button variant="ghost">Privacy</Button>
            <Button variant="ghost">Contact</Button>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
