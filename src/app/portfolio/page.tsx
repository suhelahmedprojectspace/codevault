'use client';

import React from 'react';
import { FiArrowRight, FiCode, FiLayers, FiShare2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

const PortfolioPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleStartBuilding = () => {
    const targetRoute = '/dashboard/portfolio';
    if (status === 'loading') return;
    if (!session) {
      signIn(undefined, { callbackUrl: targetRoute });
    } else {
      router.push(targetRoute);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Craft Your Competitive Edge
          </span>
          <br />
          Developer Portfolio That Gets Noticed
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          In today's competitive market, your portfolio is your strongest advocate. We help you
          showcase your technical prowess in a way that resonates with hiring managers and clients
          alike.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium 
              hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            onClick={handleStartBuilding}
          >
            Start Building — It's Free <FiArrowRight className="ml-2" />
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center">
            See Examples
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: <FiCode className="h-8 w-8 text-blue-600" />,
            title: 'Technical Showcase',
            description:
              'Highlight your stack with interactive code snippets that demonstrate real skills',
          },
          {
            icon: <FiLayers className="h-8 w-8 text-indigo-600" />,
            title: 'Project Storytelling',
            description:
              'Frame your work with compelling narratives about challenges and solutions',
          },
          {
            icon: <FiShare2 className="h-8 w-8 text-purple-600" />,
            title: 'Effortless Sharing',
            description: 'One-click sharing optimized for recruiters and technical reviewers',
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-blue-50 p-3 rounded-full">{item.icon}</div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3 text-gray-900">{item.title}</h3>
            <p className="text-gray-600 text-center">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <p className="text-gray-500 italic mb-4">
          "After using this portfolio builder, I received 3x more interview requests. The structured
          format helped me present my skills more effectively."
        </p>
        <p className="font-medium text-gray-900">— Sarah K., Frontend Developer at 100xdevs</p>
      </div>
    </div>
  );
};

export default PortfolioPage;
