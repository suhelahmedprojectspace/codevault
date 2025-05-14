import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CodeSection = () => {
  return (
    <section className="w-full px-4 py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-3 sm:mb-4">
            DEVELOPER EFFICIENCY
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Organize
            </span>{" "}
            Your Code Like a Pro
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Save hours of searching - store and retrieve code snippets in
            seconds
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 sm:space-y-12">
          {/* Step 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium mr-3 sm:mr-4">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Claim Your Code
                </h3>
              </div>
              <input
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder-gray-400 text-gray-700 text-sm sm:text-base"
                placeholder="e.g. 'Authentication middleware'"
                disabled
              />
              <p className="text-xs sm:text-sm text-gray-400">
                Tip: Use specific, search-friendly names
              </p>
            </div>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium text-gray-800">
                    Why this matters:
                  </span>{" "}
                  Proper naming creates mental ownership and makes your code 3x
                  more reusable (according to 2023 developer surveys).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Step 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-3 sm:space-y-4 order-1 md:order-2">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium mr-3 sm:mr-4">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Set the Context
                </h3>
              </div>
              <Select>
                <SelectTrigger className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white hover:border-gray-300 text-gray-700 text-sm sm:text-base">
                  <SelectValue placeholder="What technology is this for?" />
                </SelectTrigger>
                <SelectContent className="rounded-lg sm:rounded-xl border border-gray-200 shadow-lg">
                  <SelectItem
                    value="react"
                    className="px-3 py-2 sm:px-4 sm:py-3"
                  >
                    React
                  </SelectItem>
                  <SelectItem
                    value="nextjs"
                    className="px-3 py-2 sm:px-4 sm:py-3"
                  >
                    Next.js
                  </SelectItem>
                  <SelectItem
                    value="node"
                    className="px-3 py-2 sm:px-4 sm:py-3"
                  >
                    Node.js
                  </SelectItem>
                  <SelectItem
                    value="python"
                    className="px-3 py-2 sm:px-4 sm:py-3"
                  >
                    Python
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow order-2 md:order-1">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium text-gray-800">Pro Tip:</span>{" "}
                  Selecting the right framework helps our system provide you
                  with relevant suggestions and compatibility checks.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium mr-3 sm:mr-4">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Your Code Showcase
                </h3>
              </div>
              <div className="bg-gray-50 text-gray-800 rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-white border-b border-gray-200">
                  <span className="font-mono text-xs sm:text-sm text-gray-600">
                    utils/debounce.js
                  </span>
                  <div className="flex space-x-1 sm:space-x-2">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></span>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></span>
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></span>
                  </div>
                </div>
                <pre className="p-3 sm:p-4 text-xs sm:text-sm font-mono overflow-x-auto bg-white">
                  <code className="text-gray-700">
                    {`// Clean, reusable debounce implementation
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`}
                  </code>
                </pre>
              </div>
            </div>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">
                  <span className="font-medium text-gray-800">
                    Best Practice:
                  </span>{" "}
                  Well-formatted code with comments gets reused 68% more often.
                </p>
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Syntax highlighting
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1 sm:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm text-gray-600">
                      Basic formatting
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            <div className="space-y-3 sm:space-y-4 order-1 md:order-2">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium mr-3 sm:mr-4">
                  4
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Control Access
                </h3>
              </div>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                <label className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    defaultChecked
                    className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block font-medium text-gray-800 text-sm sm:text-base">
                      Public
                    </span>
                    <span className="block text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                      Visible to your team
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white hover:border-blue-400 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <span className="block font-medium text-gray-800 text-sm sm:text-base">
                      Private
                    </span>
                    <span className="block text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                      Only visible to you
                    </span>
                  </div>
                </label>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center group text-sm sm:text-base">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:translate-y-[-2px] transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save to My Code Library
              </button>
            </div>

            <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow order-2 md:order-1">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-medium text-gray-800">
                    Did you know?
                  </span>{" "}
                  Developers who organize their code properly report 40% faster
                  onboarding for new team members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeSection;
