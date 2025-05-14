import { LockKeyhole, Globe } from "lucide-react";

export const visibilityOptions = [
  { label: "Public", value: "public", logo: Globe },
  { label: "Private", value: "private", logo: LockKeyhole },
];

export type Visibility = "public" | "private";
