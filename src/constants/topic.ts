export const TopicOptions = [
  {
    label: "450 DSA Sheet",
    value: "dsa",
    image: "/images/code.png",
    description: "Top DSA problems to ace coding interviews.",
  },
  {
    label: "JavaScript Interview",
    value: "js",
    image: "/images/js.png",
    description: "Master JS essentials and tricky interview topics.",
  },
  {
    label: "System Design",
    value: "system",
    image: "/images/settings.png",
    description: "Design scalable systems with real-world patterns.",
  },
  {
    label: "React Questions",
    value: "react",
    image: "/images/react.png",
    description: "Practice React hooks, state, and lifecycle.",
  },
  // {
  //   label: "Python Coding",
  //   value: "python",
  //   image:"/images/python.png",
  //   description: "Solve problems the Pythonic way."
  // },
] as const;

export type Topic = (typeof TopicOptions)[number]["value"];
