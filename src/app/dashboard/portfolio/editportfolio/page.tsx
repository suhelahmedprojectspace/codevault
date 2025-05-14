'use client';

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardDescription,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from '@/components/ui/tabs';
import { Value } from "@radix-ui/react-select";
import TechBadgeInput from "@/components/TechBadgeInput";
import { Button } from "@/components/ui/button";
import { Badge, Trash2, X } from "lucide-react";
import MultiSelectTag from "@/components/MultiSelectTag";
import toast from "react-hot-toast";
import { SOCIAL_MEDIA_PLATFORMS } from "@/constants/socailLinks";
import axiosInstance from "@/lib/axios";
interface Portfolio {
  id: string;
  profile: string;
  name: string;
  title: string;
  summary: string;
  education: string;
  yearofexperience: string;
  passionate: string;
  location: string;
  user: {
    id: string;
    email: string;
  };
  links: { platform: string; url: string }[];
  experiences: {
    id: string;
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    currentlyWorking: boolean;
    techTag: string[];
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
  availability:string;
  certifications: {
    id: string;
    title: string;
    description: string;
    url: string;
  }[];
}

interface Stack {
  id: string; 
  name: string;
  logo?: string;
}


const tabOrder=[
  'basic',
  'experience',
  'project',
  'stack',
  'social',
  'certification/courses',
  'availability',
  'preview'
]
const Page = () => {
  const router=useRouter();
  const [editData, setEditData] = useState<Portfolio | null>(null);
  const[searchTerm,setSearchTerm]=useState('');
  const [techstack, setTechstack] = useState<Stack[]>([]);
  const [newLinkPlatform, setNewLinkPlatform] = useState('');
  const[getavailability,setGetAvailability]=useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [filteredTechstack, setFilteredTechstack] = useState<Stack[]>([]);
  const [newStack, setNewStack] = useState({ name: "", logo: "" });
  // const [originalTechstack] = useState<Stack[]>(techstack);
  //console.log(techstack);
  const[selectedTechStack,setSelectedTechStack]=useState<Stack[]>([]);
  const[currentTab,setCurrentTab]=useState('basic')
  // console.log(editData);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/porfolio'); // make sure endpoint is correct
     
      setEditData(res.data.portfolio); 
      setGetAvailability(res.data.portfolio.availability)
    };
    fetchData();
  }, []);

  useEffect(() => {
      const fetchStack = async () => {
        const res = await axios.get('/techstack');
        setTechstack(res.data.data);
         setFilteredTechstack(res.data.data);
      };
      fetchStack();
    }, []);

 useEffect(() => {
  if (editData?.techstack) {
    setSelectedTechStack(editData.techstack.map(t => ({
      id: t.id,
      name: t.name,
      logo: t.logo
    })));
  }
}, [editData]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editData) return;

    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  if (!editData) return <div>Loading...</div>;
const handleExperienceChange=(id:string,field:string,value:any)=>{
       if(!editData) return;
       setEditData({
        ...editData,
        experiences:editData.experiences.map(exp=>exp.id===id?{...exp,[field]:value}:exp)
       })     
      
}
const setAvailability = (value: string) => {
  if (!editData) return;
  setEditData(prev => prev ? { ...prev, availability: value } : null);
};
const handleProjectChange=(id:string,field:string,value:any)=>{
    setEditData({
        ...editData,
        projects:editData.projects.map(exp=>exp.id===id?{...exp,[field]:value}:exp)
    })
}
const removeExperiences=(id:string)=>{
  setEditData({
    ...editData,
    experiences:editData.experiences.filter(exp=>exp.id!==id)
  })
}
const addExperience=()=>{
 setEditData({
  ...editData,
  experiences:[
    ...editData.experiences,{
       id:crypto.randomUUID(),
       role:'',
       company:'',
       startDate:'',
       endDate:'',
       description:'',
       currentlyWorking:false,
       techTag:[]
    }
  ]
 }) 
}
const addProject=()=>{
  setEditData({
    ...editData,
    projects:[
      ...editData.projects,{
        id:crypto.randomUUID(),
        link: '',
        title: '',
        description: '',
        techTag: []
      }
    ]
  })
}
const removeProject=(id:string)=>{
  setEditData({
    ...editData,
    projects:editData.projects.filter(proj=>proj.id!==id)
  })
}
const handleAddStack = () => {
  const matchedItem = techstack.find((t) =>
    t.name.toLowerCase().includes(newStack.name.toLowerCase())
  );
  const alreadyExists = editData.techstack.some((item) =>
    item.name.toLowerCase() === (matchedItem?.name || newStack.name).toLowerCase()
  );

  if (alreadyExists) {
    toast("Stack already added!", {
      icon: "⚠️",
      style: {
        borderRadius: "8px",
        background: "white",
        color: "red",
       
      },
    });
    return;
  }

  // Prepare the new stack item
  const newstack = {
    id: crypto.randomUUID(),
    name: matchedItem?.name || newStack.name,
    logo: matchedItem?.logo || '', // or "" if you prefer
  };

  setEditData((prev) => {
  if (!prev) return null; 
  return {
    ...prev,
    techstack: [...prev.techstack, newstack],
  };
});

  toast.success("Stack added!");
};
const removeStack=(name:string)=>{
   const newStack=editData.techstack.filter(t=>t.name!==name);
   setEditData({
    ...editData,
    techstack:newStack
   })
}
  const handleCertificationChange = (id: string, field: string, value: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      certifications: editData.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

const addCertification = () => {
    if (!editData) return;
    setEditData({
      ...editData,
      certifications: [
        ...editData.certifications,
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          url: ''
        }
      ]
    });
  };

  const handleSubmit=async()=>{
  if (!editData) return;
  const formData = new FormData();
  formData.append("title", editData.title);
  formData.append("summary", editData.summary);
  formData.append("name", editData.name);
  formData.append("education", editData.education);
  formData.append("passionate", editData.passionate);
  formData.append("location", editData.location);
  formData.append("yearofexperience", editData.yearofexperience);
  formData.append("availability", editData.availability);

  // Only append profile if it's a File (i.e., new upload)
  if (editData.profile && typeof editData.profile !== "string") {
    formData.append("profile", editData.profile); // assuming File
  }

  formData.append("experiences", JSON.stringify(editData.experiences));
  formData.append("projects", JSON.stringify(editData.projects));
  formData.append("techstack", JSON.stringify(editData.techstack));
  formData.append("certifications", JSON.stringify(editData.certifications));
  formData.append("links", JSON.stringify(editData.links));

  try {
      const res=await axios.patch('/porfolio',formData,{
        headers:{
           "Content-Type": "multipart/form-data",
        }
      })
    toast.success("Portfolio updated successfully!", {
    icon: "🚀",
   style: {
    borderRadius: "10px",
    background: "#f0fdf4", 
    color: "#166534",      
    border: "1px solid #bbf7d0",
    padding: "12px 16px",
    fontWeight: 500,
    fontSize: "14px",
  },

    });
      console.log("Portfolio updated successfully:", res);
  } catch (error) {
     console.error("Something went wrong:", error);    
  }finally{
     router.push('/portfolio/userprofile')
  }

  }
  const removeCertification = (id: string) => {
    if (!editData) return;
    setEditData({
      ...editData,
      certifications: editData.certifications.filter(cert => cert.id !== id)
    });
  };


return (
    <Card className="overflow-hidden">
       <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Your Portfolio</CardTitle>
          <CardDescription>Complete each section to build your perfect portfolio</CardDescription>
       </CardHeader>
       <Tabs value={currentTab} onValueChange={setCurrentTab} className="relative">
        <div className="overflow-x-auto">
             <TabsList className="w-full flex bg-transparent p-0">
              {tabOrder.map((tab,index)=>(
                <div key={tab} className="flex items-center">
                  <TabsTrigger value={tab} className="relative px-4 py-2 rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                          {currentTab === tab && (
                                            <motion.div
                                              layoutId="activeTabIndicator"
                                              className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary"
                                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                  )}
                   {index < tabOrder.length - 1 && (
                      <div className="h-6 w-px bg-border mx-1" />
                    )}
                  </TabsTrigger>
                </div>
              ))
              }
             </TabsList>
        </div>
        <LayoutGroup>
            <TabsContent value={currentTab} className="mt-0">
              <AnimatePresence mode="wait">
                  <motion.div
                       key={currentTab}
                       initial={{ opacity: 0, x: currentTab === 'preview' ? -50 : 50 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: currentTab === 'preview' ? 50 : -50 }}
                       transition={{ duration: 0.3 }}
                       className="p-6"
                  >
                  {currentTab === 'basic' && (
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Full Name</label>
                        <Input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium">Professional Title</label>
                        <Input
                          type="text"
                          name="title"
                          value={editData.title}
                          onChange={handleChange}
                          placeholder="e.g. Senior Developer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Education</label>
                      <Input 
                        type="text"
                        name="education"
                        placeholder="e.g., B.Sc in Computer Science"
                        value={editData.education}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Years of Experience</label>
                      <Input 
                        type="text"
                        name="yearofexperience"
                        placeholder="e.g., 5 years with JavaScript"
                        value={editData.yearofexperience}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Location</label>
                      <Input 
                        type="text"
                        name="location"
                        placeholder="e.g., San Francisco, USA"
                        value={editData.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Passion</label>
                      <Textarea 
                        name="passionate"
                        placeholder="What drives your passion in tech or development?"
                        value={editData.passionate}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Professional Summary</label>
                      <Textarea 
                        name="summary"
                        placeholder="Brief summary of your professional background"
                        value={editData.summary}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                )}

                    {currentTab==="experience" && (
                        <CardContent className="p-0 space-y-4">
                           <LayoutGroup>
                                {editData.experiences.map((exp)=>(
                                    <motion.div
                                     key={exp.id}
                                     layout
                                     initial={{opacity:0,y:20}}
                                     animate={{opacity:1,y:20}}
                                     exit={{opacity:0,y:-20}}
                                     transition={{ duration: 0.2 }}
                                     className="p-4 border rounded-lg relative"
                                    >
                                     <div className="absolute top-2 right-6">
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeExperiences(exp.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                                    <Trash2 className="h-4 w-4 text-white" />
                                  </Button>
                                  </div>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4 mt-4">    
                                        <div>
                                        <label className="block text-sm font-medium mb-1">Company</label>
                                         <Input 
                                           type="text"
                                           value={exp.company}
                                           onChange={(e)=>handleExperienceChange(exp.id,'company',e.target.value)}
                                           placeholder="Company name"
                                           />
                                        </div> 
                                        <div>
                                        <label className="block text-sm font-medium mb-1">Role</label>
                                         <Input 
                                           type="text"
                                           value={exp.role}
                                           onChange={(e)=>handleExperienceChange(exp.id,'role',e.target.value)}
                                           placeholder="Your Role "
                                           />
                                        </div> 
                                        <div className="flex flex-wrap gap-4 w-full ">
                                        <div className="flex-1 min-w-[150px]">
                                <label className="text-sm font-medium mb-1">Start Date</label>
                                <Input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                              />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                              <label className="text-sm font-medium mb-1">End Date</label>
                              <div className="flex items-center gap-3">
                                <Input 
                                type="date"
                                value={exp.currentlyWorking ? '' : (exp.endDate || '')}
                                onChange={(e)=>handleExperienceChange(exp.id,'endDate',e.target.value)}
                                disabled={exp.currentlyWorking}
                                className={exp.currentlyWorking?"opacity-50":""}
                                />
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                   type="checkbox"
                                   checked={exp.currentlyWorking}
                                   onChange={(e)=>handleExperienceChange(exp.id,'currentlyWorking', e.target.checked)}
                                   className="h-4 w-4"
                                  />
                                  Currently Working
                                </label>
                              </div>   
                            </div>
                            </div>
                            </div>  
                            <div className="mb-4 w-full">
                                  <label className="block text-sm font-medium mb-1">Description</label>
                                  <Textarea
                                  value={exp.description}
                                  className="w-full"
                                  onChange={(e)=>handleExperienceChange(exp.id,'description',e.target.value)}
                                  rows={4}
                                  />
                            </div>
                            
                           <TechBadgeInput
                           tags={exp.techTag || []}
  setTags={(newTags) => handleExperienceChange(exp.id, 'techTag', newTags)}
/>
                                </motion.div>
                                ))}
                                <Button
                      type="button"
                      variant="outline"
                      onClick={addExperience}
                      className="w-full mt-4"
                    >
                       Add Experience
                    </Button>
                    </LayoutGroup>
                    </CardContent>
                    )}

                    {currentTab=='project' && (
                     <CardContent className="space-y-8">
                      <LayoutGroup>
                         {editData.projects.map((proj)=>(
                          <motion.div
                              key={proj.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 border rounded-lg relative"
                           >
                             <div className="absolute top-2 right-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => removeProject(proj.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-2 mb-4">
               <div className="space-y-2">
                              <label className="block text-sm font-medium mb-1">Project Title</label>
                              <Input
                                value={proj.title}
                                onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                                placeholder="Project name"
                              />
                </div>
                <div className="space-y-2">
                              <label className="block text-sm font-medium mb-1">Project Url</label>
                              <Input
                                value={proj.link}
                                onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)}
                                placeholder="http://example.com"
                              />
                </div>
                
          </div>
          <div className="space-y-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                             value={proj.description}
                             onChange={(e)=>handleProjectChange(proj.id,'description',e.target.value)}
                            />
                </div>
                 <TechBadgeInput
                            tags={proj.techTag}
                            setTags={(newTags) => handleProjectChange(proj.id, 'techTag', newTags)}
                />

                          </motion.div>
                         ))}
                      </LayoutGroup>
                        <Button
                      type="button"
                      variant="outline"
                      onClick={addProject}
                      className="w-full mt-4"
                    >
                      Add Project
                    </Button>
                     </CardContent>                     
                    )}
                    {currentTab==="stack" && (
                      <CardContent className="space-y-3">
                          <motion.div
                           layout   
                          >
                            <div className="gap-2 flex flex-wrap">
                            {editData.techstack.map((item)=>(
                               <Button key={item.id} variant="outline" className="flex gap-2 items-center">
                                <span className="flex space-x-1 items-center">
                                     {item.logo ? (<img src={item.logo} alt={item.name} className="w-4 h-4" />):(
                                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                {item.name.charAt(0).toUpperCase()}
              </div>
                                     )}
                                    <span>{item.name}</span>        
                                </span>
                                <span onClick={(e)=>removeStack(item.name)}><X className="hover:text-red-600"/></span>
                               </Button>
                              
                            ))}
                            
                            {/* <div className="flex flex-col h-[300px] overflow-y-auto w-full border rounded-md">
                                 {filteredTechstack.length>0?(
                                    filteredTechstack.map((tech)=>(
                                      <div key={tech.id} 
                                       className={`flex p-3 gap-3 items-center transition-colors cursor-pointer ${
                                       editData.techstack.some(t => t.id === tech.id)
                                       ? "bg-accent"
                                      : "hover:bg-accent/50" }`}
                                       onClick={() => handleAddToPortfolio(tech)}
                                      >

                                      </div>
                                    ))

                                 ):(
                                     <div className="p-4 text-center text-muted-foreground">
                            No matching technologies found
                          </div>         
                                 )}
                               
                            </div> */}
                            </div>
                            <div className="flex gap-2 pt-2">
                            <Input type="text"  
                             placeholder="Search or add new stack..." 
                             name="techstack"
                             value={newStack.name}
                             onChange={(e) => setNewStack({ ...newStack, name: e.target.value })}
                             className="pr-10" 
                             />
                             <Button type="button" onClick={handleAddStack}>
                                Add New Stack
                             </Button>
                            </div>
                          </motion.div>
                      </CardContent>
                    )}
                  </motion.div>
                  {currentTab === 'social' && (
                 <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editData.links.map((item) => {
                const platform = SOCIAL_MEDIA_PLATFORMS.find(t => t.label === item.platform);
                if (!platform) return null;
                const Icon = platform.icon;
                return (
          <div 
            key={item.platform} 
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{platform.label}</p>
                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {item.url}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive/80"
              onClick={() => {
                setEditData({
                  ...editData,
                  links: editData.links.filter(link => link.platform !== item.platform)
                });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>

    <div className="mt-6 space-y-4">
      <div className="flex gap-3 items-center">
        <Select
          value={newLinkPlatform}
          onValueChange={setNewLinkPlatform}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
              <SelectItem key={platform.label} value={platform.label}>
                <div className="flex items-center gap-2">
                  <platform.icon className="h-4 w-4" />
                  {platform.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="url"
          placeholder="Enter profile URL"
          value={newLinkUrl}
          onChange={(e) => setNewLinkUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => {
            if (newLinkPlatform && newLinkUrl) {
              setEditData({
                ...editData,
                links: [
                  ...editData.links,
                  {
                    platform: newLinkPlatform,
                    url: newLinkUrl
                  }
                ]
              });
              setNewLinkPlatform('');
              setNewLinkUrl('');
            }
          }}
          disabled={!newLinkPlatform || !newLinkUrl}
        >
          Add Link
        </Button>
      </div>
    </div>
  </CardContent>

)}
 {currentTab === "certification/courses" && (
                  <CardContent className="space-y-6">
                    {editData.certifications.map((cert) => (
                      <motion.div
                        key={cert.id}
                        layout
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              value={cert.title}
                              onChange={(e) => handleCertificationChange(cert.id, 'title', e.target.value)}
                              placeholder="Certification name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <Input
                              value={cert.url}
                              onChange={(e) => handleCertificationChange(cert.id, 'url', e.target.value)}
                              placeholder="https://example.com/certificate"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Textarea
                            value={cert.description}
                            onChange={(e) => handleCertificationChange(cert.id, 'description', e.target.value)}
                            rows={2}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeCertification(cert.id)}
                          >
                            Remove Certification
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCertification}
                      className="w-full mt-4"
                    >
                      + Add Certification
                    </Button>
                  </CardContent>
                )}

                {currentTab === 'availability' 
                && (
                                     
                                      <CardContent className="p-4">
                                        <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ delay: 0.1 }}
                                          className="space-y-4"
                                        >
                                          <div>
                                            <label className="block text-sm font-medium mb-1">Availability Status</label>
                                          
                                            <Select
                                              value={editData?.availability}
                                              onValueChange={setAvailability}
                                            >
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select your availability" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="open">Open to work</SelectItem>
                                                <SelectItem value="freelance">Available for freelance</SelectItem>
                                                <SelectItem value="part-time">Available part-time</SelectItem>
                                                <SelectItem value="not-looking">Not currently looking</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                            
                                        </motion.div>
                                      </CardContent>
                                    )}

                {/* Preview Tab */}
                {currentTab === "preview" && (
                  <CardContent className="space-y-6">
                    <div className="border rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Basic Information</h2>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{editData.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Title</p>
                          <p className="font-medium">{editData.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Education</p>
                          <p className="font-medium">{editData.education}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{editData.yearofexperience}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{editData.location}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm text-gray-500">Summary</p>
                        <p className="font-medium whitespace-pre-line">{editData.summary}</p>
                      </div>

                      <div className="mb-6">
                        <p className="text-sm text-gray-500">Passion</p>
                        <p className="font-medium whitespace-pre-line">{editData.passionate}</p>
                      </div>
                    </div>

                    {editData.experiences.length > 0 && (
                      <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Experience</h2>
                        {editData.experiences.map((exp) => (
                          <div key={exp.id} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">{exp.role}</h3>
                                <p className="text-gray-600">{exp.company}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                                </p>
                              </div>
                            </div>
                            <p className="mt-2 whitespace-pre-line">{exp.description}</p>
                            {exp.techTag.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {exp.techTag.map((tag) => (
                                  <div className="bg-blue-600/90 p-2 text-white rounded-xl font-semibold">
                                    {tag}
                                   </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {editData.projects.length > 0 && (
                      <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Projects</h2>
                        {editData.projects.map((proj) => (
                          <div key={proj.id} className="mb-6 last:mb-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold">{proj.title}</h3>
                              {proj.link && (
                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  View Project
                                </a>
                              )}
                            </div>
                            <p className="mt-1 whitespace-pre-line">{proj.description}</p>
                            {proj.techTag.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {proj.techTag.map((tag) => (
                                  <div className="bg-blue-600/90 p-2 text-white text-center rounded-xl font-semibold">
                                    {tag}
                                   </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {editData.techstack.length > 0 && (
                      <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
                        <div className="flex flex-wrap gap-4">
                          {editData.techstack.map((tech) => (
                            <div key={tech.id} className="flex items-center gap-2">
                              {tech.logo && (
                                <img src={tech.logo} alt={tech.name} className="h-8 w-8" />
                              )}
                              <span>{tech.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {editData.links.length > 0 && (
                      <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Social Links</h2>
                        <div className="flex flex-wrap gap-4">
                          {editData.links.map((link, index) => (
                            <a 
                              key={index} 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-primary hover:underline"
                            >
                              {link.platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {editData.certifications.length > 0 && (
                      <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Certifications</h2>
                        <div className="space-y-4">
                          {editData.certifications.map((cert) => (
                            <div key={cert.id}>
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold">{cert.title}</h3>
                                {cert.url && (
                                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    View Certificate
                                  </a>
                                )}
                              </div>
                              <p className="mt-1 whitespace-pre-line">{cert.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}


           </AnimatePresence>
            </TabsContent>
        </LayoutGroup>
       </Tabs>
        <CardFooter>
          <Button type="button" onClick={handleSubmit}>
               Update Profolio
          </Button>
        </CardFooter>
    </Card>
  );
};

export default Page;
