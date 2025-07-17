"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { SOCIAL_MEDIA_PLATFORMS } from "@/constants/socailLinks";
import Logo from "@/components/Logo";
import { useParams } from "next/navigation";
interface Portfolio {
  profile: string;
  name: string;
  title: string;
  summary: string;
  education: string;
  yearofexperience: string;
  passionate: string;
  location: string;
  user: {
    email: string;
  };
  links: {
    platform: string;
    url: string;
  }[];
  experiences: {
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    currentlyWorking: boolean;
    techTag: [];
  }[];
  projects: {
    id: string;
    link: string;
    title: string;
    description: string;
    techTag: [];
  }[];
  techstack: {
    id: string;
    logo: string;
    name: string;
  }[];
  certifications: {
    id: string;
    title: string;
    description: string;
    url: string;
  }[];
}

export default function PortfolioPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!id) return;
    const fetchPortfolio = async () => {
      setProgress(10);
      const response = await axios.get(`/porfolio/${id}`, {
        onDownloadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / (e.total || 100));
          setProgress(percent);
        },
      });
      setProgress(90);
      //   console.log(response.data);
      setTimeout(() => {
        setPortfolio(response.data.response);
        setProgress(100);
      }, 500);
    };
    fetchPortfolio();
  }, [id]);

  if (!portfolio)
    return (
      <div className="flex flex-col items-center bg-zinc-900 justify-center text-center min-h-screen">
        <h1 className="text-4xl md:text-6xl font-bungee mb-6 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300%">
            Loading Portfolio
          </span>
        </h1>
        <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden mb-6 relative">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-white font-semibold">
              {progress}%
            </span>
          </div>
        </div>

        <p className="font-poiret text-md md:text-xl text-gray-300 leading-relaxed max-w-xl">
          Crafting something special for you.
          <br />
          Please hang tight while we prepare your portfolio experience.
        </p>
      </div>
    );
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Social Proof Badge */}
            {/* <div className="inline-flex items-center bg-zinc-800/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/10">
              <div className="flex -space-x-2 mr-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white"></div>
                ))}
              </div>
              <span className="font-medium text-sm">Trusted by 50+ clients</span>
            </div> */}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="text-gray-300 font-light block">Hello, I'm</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent block">
                {portfolio.name}
              </span>
            </h1>

            <div className="relative inline-block mb-8">
              <h2 className="text-2xl sm:text-3xl text-gray-300 font-medium">
                {portfolio.title}
              </h2>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full animate-underline-expand"></div>
            </div>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl">
              {portfolio.summary}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="#projects"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
                View My Work
              </Link>
              <Link
                href="#contact"
                className="px-8 py-3 border border-white/20 rounded-full font-medium hover:bg-white/10 transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Let's Connect
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-white/50 flex justify-center">
            <div className="h-2 w-0.5 bg-white mt-1.5 animate-scroll-indicator"></div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <Card className="bg-zinc-800/60 border border-white/10 backdrop-blur-md shadow-lg overflow-hidden relative group">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: "blur(40px)",
                }}
              />
            ))}
          </div>

          {/* Glow border effect */}
          {/* <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30  group-hover:opacity-100 transition-opacity duration-500"></div>
    </div> */}

          <CardContent className="py-10 px-8 relative z-10">
            <CardTitle className="text-3xl font-bold mb-6 text-white">
              The Stack That Built Me
            </CardTitle>

            <ul className="space-y-4 text-gray-300 text-lg">
              {[
                {
                  icon: "🎓",
                  text: `${portfolio.education}`,
                  color: "text-blue-400",
                  animation: "animate-bounce",
                },
                {
                  icon: "💼",
                  text: `${portfolio.yearofexperience}`,
                  color: "text-purple-400",
                  animation: "animate-pulse",
                },
                {
                  icon: "🌍",
                  text: `Based in ${portfolio.location}`,
                  color: "text-emerald-400",
                  animation: "animate-spin-slow",
                },
                {
                  icon: "💬",
                  text: `${portfolio.passionate}`,
                  color: "text-amber-400",
                  animation: "animate-float",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className={`text-2xl ${item.color} ${item.animation}`}>
                    {item.icon}
                  </span>
                  <span className="flex-1">
                    {item.text}
                    <div className="w-full h-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mt-1"></div>
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link
                href="/resume.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 rounded-full font-medium bg-gradient-to-r  from-blue-600/90 to-purple-600/90 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-white">
                    Download Resume
                  </span>
                </span>

                <span className="absolute -inset-1 rounded-full bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></span>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </section>
      <section className="py-20 px-6 max-w-7xl mx-auto" id="tech-stack">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Tech Mastery
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Tools & technologies I wield to craft exceptional digital
            experiences
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolio.techstack.map((tech) => (
            <motion.div
              key={tech.id}
              className="group relative"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              <div className="flex flex-col items-center p-6 bg-zinc-800/60 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 h-full">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                   {tech.logo ? (
                                           <img
                                       width={64}
                                       height={64}
                                       src={tech.logo}
                                       alt={tech.name}
                                       className="object-contain h-full w-full"
                                     />
                                     ):(
                                      <span className="text-4xl text-center font-extrabold text-blue-600">{tech.name.charAt(0).toLocaleUpperCase()}</span>
                                     )}
                </div>
                <h3 className="text-lg font-medium text-center text-gray-300 group-hover:text-white transition-colors">
                  {tech.name}
                </h3>
                <div className="mt-2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-400 mb-6 max-w-3xl mx-auto">
            I constantly refine my toolkit — adopting what's next, mastering
            what matters.
          </p>
          <Link
            href="#contact"
            className="inline-flex items-center px-8 py-3 rounded-full font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Discuss a Project
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </Link>
        </motion.div>
      </section>
      <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Projects That Solve Real Problems
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore the digital products I've crafted with purpose and precision
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolio.projects.map((project) => (
            <motion.div
              key={project.id}
              className="group relative"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

              <Card className="h-full bg-zinc-800/60 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{project.description}</p>

                  {project.techTag && project.techTag.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techTag.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs px-3 py-1 rounded-full bg-zinc-700/50 text-blue-300 border border-blue-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm px-4 py-2 rounded-full bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View Project
                    </Link>
                  )}
                  {/* <div className="text-xs text-gray-400">
              {project.link?.replace(/^https?:\/\//, '')}
            </div> */}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {portfolio.experiences && portfolio.experiences.length > 0 && (
        <section id="experience" className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Professional Journey
            </motion.h2>
            <motion.p
              className="text-xl text-gray-400 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              My career path and the valuable experiences I've gained
            </motion.p>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500/20 via-purple-500/50 to-transparent -translate-x-1/2"></div>
            {portfolio.experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className={`relative mb-12 ${index % 2 === 0 ? "md:pr-8 md:pl-0 md:text-right" : "md:pl-8 md:text-left"}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={`flex flex-col md:flex-row ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
                >
                  <div
                    className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8"}`}
                  >
                    <div className="bg-zinc-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg relative">
                      {/* Timeline dot */}
                      {/* <div className="absolute top-6 -left-10 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-4 border-zinc-900 -translate-x-1/2"></div> */}
                      {
                        //This creates a zig-zag timeline effect on larger screens (md: breakpoint and above).
                        // Even index (0, 2, 4...):
                        // Experience box is pushed to the right side of the vertical line.
                        // Uses: md:pr-8 md:text-right
                        // Odd index (1, 3, 5...):
                        // Experience box is pushed to the left side of the vertical line.
                        // Uses: md:pl-8 md:text-left
                        // On mobile screens, it stacks vertically (default flex-col), so this condition mainly impacts layout and text alignment on desktops.
                      }
                      <div
                        className={`flex flex-col ${index % 2 !== 0 ? "items-start text-left" : "items-start text-right"}`}
                      >
                        <h3 className="text-xl font-bold text-white mb-1">
                          {exp.role}
                        </h3>
                        <div className="text-blue-400 font-medium mb-2">
                          {exp.company}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <span>
                          {new Date(exp.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="mx-2">—</span>
                        <span>
                          {exp.currentlyWorking ? (
                            <span className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-xs font-medium">
                                Currently Working
                              </span>
                            </span>
                          ) : (
                            new Date(exp.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })
                          )}
                        </span>
                        {/* {exp.currentlyWorking && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-green-500 text-white text-xs"></span>
                  )} */}
                      </div>

                      <p className="text-gray-300 mb-4 text-justify">
                        {exp.description}
                      </p>

                      {exp.techTag && exp.techTag.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.techTag.map((tech, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-zinc-700/50 text-purple-300 border border-purple-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      <section id="achievements" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Achievements & Milestones
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Recognitions and certifications that validate my expertise
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {portfolio.certifications &&
            portfolio.certifications.map((cert) => (
              <motion.div
                key={cert.id}
                className="group relative"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {/* Certificate card */}
                <Card className="h-full bg-zinc-800/60 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden">
                  {/* Ribbon effect */}
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-8 bg-blue-600 transform rotate-45 translate-y-4 translate-x-8 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        Certified
                      </span>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-500/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-white">
                          {cert.title}
                        </CardTitle>
                        <div className="text-sm text-blue-400 mt-1">
                          Professional Certification
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-300">{cert.description}</p>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center border-t border-white/10 pt-4">
                    {cert.url && (
                      <Link
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-4 py-2 rounded-full bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 transition-colors flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verify Credential
                      </Link>
                    )}
                    <div className="text-xs text-gray-400">
                      {cert.url?.replace(/^https?:\/\//, "").split("/")[0]}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
        </motion.div>

        {/* Additional achievements section */}
        {/* {portfolio.achievements && (
    <motion.div 
      className="mt-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10 rounded-xl p-8 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">Notable Achievements</h3>
      <div className="space-y-4">
        {portfolio.achievements.split('\n').filter(a => a.trim()).map((achievement, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
            </div>
            <p className="text-gray-300">{achievement}</p>
          </div>
        ))}
      </div>
    </motion.div> */}
        {/* )} */}
      </section>
      <section id="contact" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Connect With Me
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Let's collaborate and build something amazing together
          </motion.p>
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
            const match = portfolio.links?.find((link) =>
              link.url?.includes(platform.baseUrl),
            );
            if (!match) return null;

            const Icon = platform.icon;
            const platformName = platform.label.replace(
              "X (Twitter)",
              "Twitter",
            ); // Clean up name

            return (
              <motion.div
                key={platform.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                <Link
                  href={match.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl bg-zinc-800/60 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  aria-label={`Connect on ${platformName}`}
                >
                  <div className="relative mb-3">
                    <Icon className="h-10 w-10 text-gray-300 group-hover:text-white transition-colors" />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs bg-zinc-700 text-white px-2 py-1 rounded whitespace-nowrap">
                      {platformName}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-400 mb-6 max-w-3xl mx-auto">
            Prefer email? Reach out directly for collaborations or inquiries
          </p>
          <Link
            href={`${portfolio.user.email}`}
            className="inline-flex items-center px-8 py-3 rounded-full font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Send Me an Email
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </Link>
        </motion.div>
      </section>
      <footer className="bg-zinc-900/90 border-t border-white/10 backdrop-blur-sm py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <Logo />
            </div>

            <nav className="flex flex-wrap justify-center gap-6">
              {[
                { name: "Home", href: "#" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
                { name: "Skills", href: "#tech-stack" },
                { name: "Contact", href: "#connect" },
              ].map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex gap-4">
              {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
                const match = portfolio.links?.find((link) =>
                  link.url?.includes(platform.baseUrl),
                );
                if (!match) return null;

                const Icon = platform.icon;
                return (
                  <motion.a
                    key={platform.id}
                    href={match.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={platform.label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p>
              © {new Date().getFullYear()} {portfolio.name}. All rights
              reserved.
            </p>
            <p className="mt-2">
              Built with ❤️ using <span className="text-blue-400">Next.js</span>
              , <span className="text-purple-400">Tailwind CSS</span>, and{" "}
              <span className="text-pink-400">Framer Motion</span>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
