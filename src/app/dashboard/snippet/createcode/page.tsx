'use client';

import * as React from 'react';
import {
  ClipboardPaste,
  Trash2,
  Code2,
  Save,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Users,
  ChevronsUpDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRef, useState } from 'react';
import { Visibility, visibilityOptions } from '@/constants/visibility';
import { Framework, FrameworkOptions } from '@/constants/framework';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';
import { TabsList, TabsTrigger, Tabs } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

export default function CodeEditor() {
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [selectedFramework, setSelectedFramework] = useState<Framework | undefined>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
  });
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const codeRef = useRef<HTMLTextAreaElement>(null);

  const handlePasteCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const text = await navigator.clipboard.readText();
      if (codeRef.current) {
        codeRef.current.value = text;
        setFormData({ ...formData, content: text });
      }
      toast.success('Code pasted from clipboard');
    } catch (err) {
      toast.error('Failed to paste code. Please allow clipboard permissions.');
    }
  };

  const handleClearCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (codeRef.current) {
      codeRef.current.value = '';
      setFormData({ ...formData, content: '' });
    }
    toast.success('Editor cleared');
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and code content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post('/snippet', {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        visibility,
        framework: selectedFramework,
      });

      if (res.status === 201) {
        toast.success('Code snippet created successfully!');
        setFormData({ title: '', description: '', content: '' });
        setSelectedFramework(undefined);
        setVisibility('public');
        if (codeRef.current) codeRef.current.value = '';
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create snippet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityIcon = (value: Visibility) => {
    switch (value) {
      case 'public':
        return <Globe className="w-4 h-4" />;
      case 'private':
        return <Lock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-start p-4 md:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                <span>Create Code Snippet</span>
              </CardTitle>
              <CardDescription>Store and organize your reusable code snippets</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {selectedFramework ? (
                  <>
                    {FrameworkOptions.find((f) => f.value === selectedFramework)?.icon({
                      className: 'w-3 h-3',
                    })}
                    {FrameworkOptions.find((f) => f.value === selectedFramework)?.label}
                  </>
                ) : (
                  'No framework'
                )}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getVisibilityIcon(visibility)}
                {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Snippet Title *</Label>
              <Input
                id="title"
                placeholder="My awesome function"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Framework & Visibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Framework Selector */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Select
                  onValueChange={(value: Framework) => setSelectedFramework(value)}
                  value={selectedFramework}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {FrameworkOptions.map((data) => (
                        <SelectItem key={data.value} value={data.value}>
                          <div className="flex items-center gap-2">
                            <data.icon className="w-4 h-4" />
                            {data.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Visibility Selector */}
              <div className="flex flex-col space-y-1.5">
                <Label>Visibility</Label>
                <RadioGroup
                  className="flex gap-2"
                  value={visibility}
                  onValueChange={(val: Visibility) => setVisibility(val)}
                >
                  {visibilityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer hidden"
                      />
                      <Label
                        htmlFor={option.value}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer',
                          'hover:bg-accent hover:text-accent-foreground',
                          'peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary',
                          'peer-data-[state=checked]:text-primary',
                        )}
                      >
                        <option.logo className="w-4 h-4" />
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What does this code do?"
                rows={2}
                className="resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Code Snippet Tabs */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="code">Code Snippet *</Label>
                <Tabs>
                  <TabsList className="grid grid-cols-2 w-40">
                    <TabsTrigger value="write" onClick={() => setActiveTab('write')}>
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" onClick={() => setActiveTab('preview')}>
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {activeTab === 'write' ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground"
                      onClick={handlePasteCode}
                    >
                      <ClipboardPaste className="w-4 h-4 mr-1" />
                      Paste
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground"
                      onClick={handleClearCode}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <Textarea
                    id="code"
                    ref={codeRef}
                    placeholder="Write or paste your code here..."
                    rows={12}
                    className="resize-none font-mono text-sm"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              ) : (
                <div className="rounded-md border p-4 bg-background overflow-auto max-h-[400px]">
                  <SyntaxHighlighter
                    language={selectedFramework || 'javascript'}
                    style={oneDark}
                    customStyle={{
                      background: 'transparent',
                      fontSize: '0.875rem',
                    }}
                  >
                    {formData.content}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Snippet'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
