import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiPhp,
  SiRuby,
  SiGo,
  SiRust,
  SiSwift,
  SiKotlin,
  SiCplusplus,
  SiC,
  SiDart,
  SiElixir,
  SiClojure,
  SiSharp,
  SiScala,
  SiPerl,
  SiHaskell,
} from 'react-icons/si';

export const FrameworkOptions = [
  { label: 'JavaScript', value: 'javascript', icon: SiJavascript },
  { label: 'TypeScript', value: 'typescript', icon: SiTypescript },
  { label: 'Python', value: 'python', icon: SiPython },
  { label: 'C', value: 'c', icon: SiC },
  { label: 'C++', value: 'cpp', icon: SiCplusplus },
  { label: 'C#', value: 'csharp', icon: SiSharp },
  { label: 'PHP', value: 'php', icon: SiPhp },
  { label: 'Ruby', value: 'ruby', icon: SiRuby },
  { label: 'Perl', value: 'perl', icon: SiPerl },

  // Functional
  { label: 'Go', value: 'go', icon: SiGo },
  { label: 'Rust', value: 'rust', icon: SiRust },
  { label: 'Swift', value: 'swift', icon: SiSwift },
  { label: 'Kotlin', value: 'kotlin', icon: SiKotlin },
  { label: 'Scala', value: 'scala', icon: SiScala },
  { label: 'Haskell', value: 'haskell', icon: SiHaskell },
  { label: 'Clojure', value: 'clojure', icon: SiClojure },
  { label: 'Dart', value: 'dart', icon: SiDart },
  { label: 'Swift', value: 'swift', icon: SiSwift },
] as const;

export type Framework = (typeof FrameworkOptions)[number]['value'];
