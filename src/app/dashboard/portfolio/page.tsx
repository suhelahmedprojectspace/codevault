'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import axios from '@/lib/axios';
import MultiSelectTag from '@/components/MultiSelectTag';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants/socailLinks';
import { useDispatch } from 'react-redux';
import { cn } from '@/lib/utils';
import { resetForm, updateForm } from '@/redux/portfolioSlice';
import { FiUpload, FiX, FiPlus, FiChevronRight, FiCheck } from 'react-icons/fi';
// import ProgressBar from '@/components/ProgressBar';
import ProgressBar from '@/components/ProgressBar';
import toast from 'react-hot-toast';
import TechBadgeInput from '@/components/TechBadgeInput';
// import axiosInstance from '@/lib/axios';
import { Skeleton } from "@/components/ui/skeleton";
interface Experience {
  id: string;
  company: string;
  role: string;
  description:string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  techTag?:string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
  techTag?:string[];
}

interface Stack {
  id: number;
  name: string;
  logo?: string;
}

interface BasicInfo {
  title: string;
  summary: string;
  education:string;
  passionate:string;
  yearofexperience:string;
  location:string;
  profile: string;
  name: string;
}

interface SocialLink {
  platform: string;
  url: string;
}
interface Tag{
  name:string;
  logo?:string;
}
interface Certification{
  id: string;
  title:string;
  description:string;
  url?:string;
}

const tabOrder = [
  'basic',
  'experience',
  'project',
  'stack',
  'social',
  'certification/courses',
  'availability',
  'preview',
];

const Page = () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState('basic');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState<BasicInfo>({
    title: '',
    summary: '',
    profile: '',
    name: '',
    location:'',
    passionate:'',
    education:'',
    yearofexperience:''
  });

  const [experience, setExperiences] = useState<Experience[]>([
    { id: crypto.randomUUID(), 
      company: '', 
      role: '',
      description:'', 
      startDate: '', 
      endDate: '', 
      currentlyWorking: false,
      techTag:[],
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: crypto.randomUUID(), title: '', description: '',techTag:[] }
  ]);

  const [techstack, setTechstack] = useState<Stack[]>([]);

  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [techTags, setTechTags] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newLink, setNewLink] = useState<{platform: string, username: string}>({ platform: '', username: '' });
  const [achievements, setAchievements] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const[certification,setCertification]=useState<Certification[]>([
    {id:crypto.randomUUID(),title:'',description:'',url:''}
  ])

  //need to work 
  const completionPercentage = Math.floor(
    (Object.values({
      ...personalInfo,
      experience: experience[0].company ? 1 : 0,
      projects: projects[0].title ? 1 : 0,
      techstack: selectedTags.length ? 1 : 0,
      socialLinks: socialLinks.length ? 1 : 0,
      achievements:achievements.length ? 1:0,
    }).filter(Boolean).length / 11) * 100
  );

  const handleExperienceChange = (id: string, field: keyof Experience, value: any) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const handleCertificationChange=(id:string,field:keyof Certification,value:any)=>{
    setCertification(prev=>prev.map(cer=>cer.id ===id ?{...cer,[field]:value}:cer))
  }

  const handleProjectChange = (id: string, field: keyof Project, value: any) => {
    setProjects(prev => prev.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const addExperience = () => setExperiences(prev => [
    ...prev, 
    { id: crypto.randomUUID(), company: '', role: '',description:'' ,startDate: '', endDate: '', currentlyWorking: false }
  ]);

  
  const removeExperience = (id: string) => {
    if (experience.length > 1) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const addProject = () => setProjects(prev => [
    ...prev, 
    { id: crypto.randomUUID(), title: '', description: '',techTag: [] }
  ]);

  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(prev => prev.filter(proj => proj.id !== id));
    }
  };

  const addCertificate=()=> setCertification(prev=>[
    ...prev,
    {id:crypto.randomUUID(),title:'',description:'',url:''}
   ]);

   const removeCertificat = (id: string) => {
    if (certification.length > 1) {
      setCertification(prev => prev.filter(cert => cert.id !== id));
    }
  };

  const addSocialLink = () => {
    if (newLink.platform && newLink.username) {
      const platform = SOCIAL_MEDIA_PLATFORMS.find(p => p.label === newLink.platform);
      if (platform) {
        setSocialLinks(prev => [
          ...prev,
          {
            platform: newLink.platform,
            url: `${platform.baseUrl}${newLink.username}`
          }
        ]);
        setNewLink({ platform: '', username: '' });
      }
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const goToNextTab = () => {
    dispatch(updateForm({
      ...personalInfo,
      profile: preview ?? undefined,
      experiences: experience,
      projects,
      techstack: selectedTags,
      links: socialLinks,
      achievements,
      availability
    }));

    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const goToPrevTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setUploadProgress(100);
    setIsUploading(false);
    clearInterval(interval);

    setTimeout(() => setUploadProgress(0), 1000);
  };

  useEffect(() => {
    const fetchStack = async () => {
      const res = await axios.get('/techstack');
      setTechstack(res.data.data);
    };
    fetchStack();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  
  const handleSubmit=async(e:React.MouseEvent)=>{
    e.preventDefault();
    try {
        const formData=new FormData();
        try {
          if(preview){
            const response = await fetch(preview);
            const blob = await response.blob();
            const file = new File([blob], 'profile.jpg', { type: blob.type });
            formData.append('profile',file);
          }
        } catch (error) {
          console.error('Error processing image:', error);
          toast.error('Failed to upload profile image')
        }
        formData.append('name', personalInfo.name);
        formData.append('title', personalInfo.title);
        formData.append('summary', personalInfo.summary);
        formData.append('education',personalInfo.education);
        formData.append('location',personalInfo.location);
        formData.append('passionate',personalInfo.passionate);
        formData.append('yearofexperience',personalInfo.yearofexperience);
        formData.append('certifications',JSON.stringify(certification));
        formData.append('experiences',JSON.stringify(experience));
        formData.append('projects',JSON.stringify(projects));
        formData.append('techstack',JSON.stringify(selectedTags));
        formData.append('links', JSON.stringify(socialLinks));
        console.log(formData);
        const response=await axios.post('/porfolio',formData,{
          headers:{
            'Content-Type':'multipart/form-data'
          },
          onUploadProgress:ProgressEvent=>{
            const percentageCompleted=Math.round(
             ( ProgressEvent.loaded * 100 )/(ProgressEvent.total || 1))
             setUploadProgress(percentageCompleted);
          }
          
        })
        if(response.status===200){
          toast.success('Successfully publised');
          console.log('Upload successful:', response.data);
        
          dispatch(resetForm())
          setPersonalInfo({ title: '', summary: '', profile: '', name: '',location:'',education:'',passionate:'',yearofexperience:'' });
          setExperiences([{ id: crypto.randomUUID(), company: '', role: '', description: '', startDate: '', endDate: '', currentlyWorking: false }]);
          setProjects([{ id: crypto.randomUUID(), title: '', description: '' }]);
          setSelectedTags([]);
          setSocialLinks([]);
          setAchievements('');
          setAvailability('');
          setPreview(null);
          setUploadProgress(0);
          setCurrentTab('basic');
        }

    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Build Your Portfolio</h1>
            <p className="text-muted-foreground">Showcase your professional journey</p>
          </div>
          <div className="w-64">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <ProgressBar progress={completionPercentage}/>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold">Portfolio Builder</CardTitle>
            <CardDescription>Complete each section to build your perfect portfolio</CardDescription>
          </CardHeader>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="relative">
            <div className="overflow-x-auto px-6 pt-4">
              <TabsList className="w-full flex bg-transparent p-0">
                {tabOrder.map((tab, index) => (
                  <div key={tab} className="flex items-center">
                    <TabsTrigger 
                      value={tab} 
                      className="relative px-4 py-2 rounded-none border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {currentTab === tab && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </TabsTrigger>
                    {index < tabOrder.length - 1 && (
                      <div className="h-6 w-px bg-border mx-1" />
                    )}
                  </div>
                ))}
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
                      <CardContent className="p-0">
                        <motion.div 
                          className="grid md:grid-cols-3 gap-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="space-y-4">
                            <div className="space-y-2 flex flex-col items-center">
                              <label className="block text-sm font-medium">Profile Photo</label>
                              <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                  {preview ? (
                                    <img 
                                      src={preview} 
                                      alt="Profile" 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="text-center p-4">
                                      <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                      <p className="mt-1 text-xs text-gray-500">Upload photo</p>
                                    </div>
                                  )}
                                </div>
                                {isUploading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                    {/* <Progress value={uploadProgress} className="w-3/4 h-2" /> */}
                                  </div>
                                )}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleUpload}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 space-y-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Full Name</label>
                              <Input 
                                placeholder="John Doe" 
                                value={personalInfo.name}
                                onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                                className="focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Professional Title</label>
                              <Input 
                                placeholder="Software Engineer" 
                                value={personalInfo.title}
                                onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                            <label className="block text-sm font-medium mb-1">Graduation / Degree Program</label>
                              <Input 
                               placeholder="e.g., B.Sc in Computer Science, B.Tech in ECE"
                                value={personalInfo.education}
                                onChange={(e) => setPersonalInfo({...personalInfo, education: e.target.value})}
                                className="focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div className="space-y-2">
                            <label className="block text-sm font-medium mb-1">  How long have you been working with this technology?</label>
                              <Input 
                                placeholder="e.g., 2 years with React.js"
                                value={personalInfo.yearofexperience}
                                onChange={(e) => setPersonalInfo({...personalInfo, yearofexperience: e.target.value})}
                                className="focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>

                            <div className="space-y-2">
                            <label className="block text-sm font-medium mb-1">  What drives your passion in tech or development?</label>
                            <Textarea 
                              placeholder="e.g., I love solving real-world problems and building user-friendly apps..." 
                             value={personalInfo.passionate}
                            onChange={(e) => setPersonalInfo({...personalInfo, passionate: e.target.value})}    
                            rows={4} />
                            </div>
                            <div className="space-y-2">
                            <label className="block text-sm font-medium mb-1">  Where are you from? (City, Country)</label>
                            <Input placeholder="e.g., Guwahati, India" 
                             value={personalInfo.location}
                             onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                            />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium">Short Summary</label>
                              <Textarea 
                                placeholder="I'm a passionate full-stack developer with 2+ years of experience building scalable web apps using React, Node.js" 
                                rows={4}
                                value={personalInfo.summary}
                                onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                              />
                            </div>
                          </div>
                        </motion.div>
                      </CardContent>
                    )}

                    {currentTab === 'experience' && (
                      <CardContent className="p-0 space-y-4">
                        <LayoutGroup>
                          {experience.map((exp) => (
                            <motion.div 
                              key={exp.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.2 }}
                              className="border rounded-lg p-4 space-y-3 relative group"
                            >
                              <button
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX className="h-4 w-4 text-gray-500" />
                              </button>
                              
                              <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Company</label>
                                  <Input
                                    placeholder="Google"
                                    value={exp.company}
                                    onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Role</label>
                                  <Input
                                    placeholder="Senior Developer"
                                    value={exp.role}
                                    onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 w-full">
                                <div>
                                  <label className="text-sm font-medium mb-1">Start Date</label>
                                  <Input
                                    type="date"
                                    value={exp.startDate}
                                    className="w-full"
                                    onChange={(e) => handleExperienceChange(exp.id, 'startDate', e.target.value)}
                                  />
                                </div>
                                <div className='flex items-center flex-row flex-wrap gap-4 '>
                                  <div className='flex flex-col'>  
                                  <label className="text-sm font-medium mb-1">End Date</label>
                                  <Input
                                      type="date"
                                      value={exp.currentlyWorking ? '' : exp.endDate}
                                      onChange={(e) => handleExperienceChange(exp.id, 'endDate', e.target.value)}
                                      disabled={exp.currentlyWorking}
                                      className={cn('w-full',exp.currentlyWorking ? 'opacity-50' : '')}
                                    />
                                  </div>
                                  <label>
                                      <input
                                        type="checkbox"
                                        checked={exp.currentlyWorking}
                                        onChange={(e) => handleExperienceChange(exp.id, 'currentlyWorking', e.target.checked)}
                                        className="h-4 w-4 text-primary rounded"
                                      />
                                      <span className="text-sm ms-3">Currently working</span>
                                    </label>
                                </div>
                               
                              </div>
                               <label className="block text-sm font-medium mb-1">Description</label>
                                  <Textarea
                                    placeholder="Built a full-stack e-commerce platform with React and Node.js..."
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                    rows={3}
                                   
                                />
                                <TechBadgeInput tags={exp.techTag || []} 
                                setTags={(newTags)=>handleExperienceChange(exp.id,'techTag',newTags)} />
                            </motion.div>
                          ))}
                        </LayoutGroup>
                        
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addExperience}
                            className="w-full mt-2"
                          >
                            <FiPlus className="mr-2" />
                            Add Experience
                          </Button>
                        </motion.div>
                      </CardContent>
                    )}

                    {currentTab === 'project' && (
                      <CardContent className="p-0 space-y-4">
                        <LayoutGroup>
                          {projects.map((proj) => (
                            <motion.div
                              key={proj.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.2 }}
                              className="border rounded-lg p-4 space-y-3 relative group"
                            >
                              <button
                                onClick={() => removeProject(proj.id)}
                                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FiX className="h-4 w-4 text-gray-500" />
                              </button>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Project Title</label>
                                <Input
                                  placeholder="E-commerce Website"
                                  value={proj.title}
                                  onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Textarea
                                  placeholder="Built a full-stack e-commerce platform with React and Node.js..."
                                  value={proj.description}
                                  onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-1">Project Link (Optional)</label>
                                <Input
                                  placeholder="https://example.com"
                                  value={proj.link || ''}
                                  onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)}
                                />
                              </div>
                              <TechBadgeInput tags={proj.techTag || []} 
                                setTags={(newTags)=>handleProjectChange(proj.id,'techTag',newTags)} />
                            </motion.div>
                          ))}
                        </LayoutGroup>
                        
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addProject}
                            className="w-full mt-2"
                          >
                            <FiPlus className="mr-2" />
                            Add Project
                          </Button>
                        </motion.div>
                      </CardContent>
                    )}

                    
                    {currentTab === 'stack' && (
                      <CardContent className="p-0">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Select Your Tech Stack</h3>
                            <p className="text-sm text-muted-foreground">
                              Choose the technologies you're proficient in
                            </p>
                          </div>
                          <MultiSelectTag
                            availableTags={techstack.map(t => ({
                              name: t.name,
                              logo: t.logo,
                            }))}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                          />
                        </motion.div>
                      </CardContent>
                    )}

              
                    {currentTab === 'social' && (
                      <CardContent className="p-0 space-y-4">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Add Your Social Links</h3>
                            <p className="text-sm text-muted-foreground">
                              Help people connect with you
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            {socialLinks.map((link, index) => (
                              <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{link.platform}</p>
                                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                                </div>
                                <button
                                  onClick={() => removeSocialLink(index)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                  <FiX className="h-4 w-4 text-gray-500" />
                                </button>
                              </motion.div>
                            ))}
                            
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <div className="grid md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Platform</label>
                                  <Select
                                    value={newLink.platform}
                                    onValueChange={(value) => setNewLink({...newLink, platform: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {SOCIAL_MEDIA_PLATFORMS.map(link => (
                                        <SelectItem key={link.id} value={link.label}>
                                          <div className="flex items-center gap-2">
                                            <link.icon className="h-4 w-4" />
                                            <span>{link.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Username</label>
                                  <Input
                                    placeholder="yourusername"
                                    value={newLink.username}
                                    onChange={(e) => setNewLink({...newLink, username: e.target.value})}
                                  />
                                </div>
                                
                                <div className="flex items-end">
                                  <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                      type="button"
                                      onClick={addSocialLink}
                                      disabled={!newLink.platform || !newLink.username}
                                      className="w-full"
                                    >
                                      Add Link
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </CardContent>
                    )}

{currentTab === 'certification/courses' && (
  <CardContent className="p-0 space-y-4">
    <LayoutGroup>
      {certification.map((cert, index) => (
        <motion.div
          key={cert.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.2 }}
          className="border rounded-lg p-4 space-y-3 relative group"
        >
          <button
            onClick={() => removeCertificat(cert.id)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiX className="h-4 w-4 text-gray-500" />
          </button>
          
          <div>
            <label className="block text-sm font-medium mb-1">Certification/Course Title</label>
            <Input
              placeholder="AWS Certified Developer"
              value={cert.title}
              onChange={(e) => handleCertificationChange(cert.id, 'title', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              placeholder="Earned by demonstrating proficiency in developing and maintaining applications on AWS"
              value={cert.description}
              onChange={(e) => handleCertificationChange(cert.id, 'description', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Certificate URL (Optional)</label>
            <Input
              placeholder="https://example.com/certificate"
              value={cert.url || ''}
              onChange={(e) => handleCertificationChange(cert.id, 'url', e.target.value)}
            />
          </div>
        </motion.div>
      ))}
    </LayoutGroup>
    
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={addCertificate}
        className="w-full mt-2"
      >
        <FiPlus className="mr-2" />
        Add Certification/Course
      </Button>
    </motion.div>
  </CardContent>
)}

                    {currentTab === 'availability' && (
                      <CardContent className="p-0">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">Availability Status</label>
                            <Select
                              value={availability}
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
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Additional Notes</label>
                            <Textarea
                              placeholder="Any specific availability details..."
                              rows={3}
                            />
                          </div>
                        </motion.div>
                      </CardContent>
                    )}

                    {currentTab === 'preview' && (
                      <CardContent className="p-0">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-6"
                        >
                          <div className="text-center py-8">
                            <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <FiCheck className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Portfolio Complete!</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Your professional portfolio is ready to share with the world.
                            </p>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <Button variant="outline" onClick={() => setCurrentTab(tabOrder[0])}>
                              Edit Portfolio
                            </Button>
                            <Button onClick={handleSubmit} disabled={completionPercentage < 100} >
                              Publish Portfolio
                            </Button>
                          </div>
                        </motion.div>
                      </CardContent>
                    )}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </LayoutGroup>
          </Tabs>

          <div className="border-t p-4 flex justify-between">
            {currentTab !== 'basic' ? (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={goToPrevTab}
                >
                  Back
                </Button>
              </motion.div>
            ) : (
              <div></div> 
            )}
            
            {currentTab !== 'preview' && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  type="button" 
                  onClick={goToNextTab}
                  className="ml-auto"
                >
                  {currentTab === 'availability' ? 'Review' : 'Next'}
                  <FiChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;