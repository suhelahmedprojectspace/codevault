"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopicOptions } from "@/constants/topic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  CpuIcon,
  Database,
  DraftingCompass,
  LockKeyhole,
  Network,
} from "lucide-react";
import { useRouter } from "next/navigation";
// const iconComponents = {
//   dsa: <Code className="w-6 h-6" />,
//   js: <CpuIcon className="w-6 h-6" />,
//   system: <Network className="w-6 h-6" />,
//   react: <DraftingCompass className="w-6 h-6" />,
//   python: <Database className="w-6 h-6" />,
// };

const colorVariants = {
  dsa: "hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
  js: "hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10",
  system:
    "hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/10",
  react:
    "hover:border-cyan-500/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10",
  python:
    "hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10",
};

const Page = () => {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 space-y-8"
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Master the Building Blocks
          </span>
          <br className="hidden sm:block" />
          <span className="text-gray-900 dark:text-gray-100">
            of Modern Development
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Choose your path through coding, system design, and modern web
          technologies. Track your progress and level up your skills.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6 }}
          className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {TopicOptions.map((topic, index) => (
          <motion.div
            key={topic.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Card
              className={`group relative h-full p-6 border-2 dark:border-gray-800 rounded-xl shadow-sm 
                hover:shadow-lg transition-all duration-300 ${colorVariants[topic.value]} 
                hover:-translate-y-2 cursor-pointer`}
              onClick={() => router.push(`${topic.value}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={topic.image}
                    alt={topic.label}
                    className="w-8 h-8 object-contians"
                  />
                  <CardTitle className="text-xl font-semibold">
                    {topic.label}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm text-muted-foreground mb-4">
                  {topic.description}
                </CardDescription>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-auto">
                  <span className="mr-2">Start Learning</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Page;
