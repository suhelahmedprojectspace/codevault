import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Certificate } from "crypto";

type Certification = {
  title: string;
  url?: string;
  description: string;
};

type PortfolioState = {
  title: string;
  summary: string;
  profile?: string;
  projects?: any;
  name: string;
  experiences?: any;
  skills: string[];
  interests?: string;
  availability?: string;
  achievements?: string;
  certifications?: Certification[];
  techstack?: { name: string; logo?: string }[];
  location: string;
  yearofexperience: string;
  passionate?: string;
  links: any[]; // can be detailed later
};

const initialState: PortfolioState = {
  title: "",
  summary: "",
  profile: "",
  projects: "",
  name: "",
  experiences: [],
  skills: [],
  interests: "",
  availability: "",
  achievements: "",
  certifications: [],
  techstack: [],
  links: [],
  location: "",
  yearofexperience: "",
  passionate: "",
};
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<Partial<PortfolioState>>) => {
      Object.assign(state, action.payload);
    },
    resetForm: () => initialState,
  },
});

export const { updateForm, resetForm } = formSlice.actions;
export default formSlice.reducer;
