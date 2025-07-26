'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';
import Editor from '@monaco-editor/react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Framework, FrameworkOptions } from '@/constants/framework';
import { Visibility, visibilityOptions } from '@/constants/visibility';
import toast from 'react-hot-toast';

const UpdateSnippetPage = () => {
  const [selectedFramework, setSelectedFramework] = useState<Framework | undefined>();
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
  });

  const [visibility, setVisibility] = useState<Visibility>('public');
  //const [selectFramework, setSelectFramework] = useState<Framework | undefined>();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  async function fetchData(id: string) {
    const res = await axios.get(`/snippet/${id}`);
    setForm({
      title: res.data.snippet.title,
      description: res.data.snippet.description,
      content: res.data.snippet.content,
    });
    setSelectedFramework(res.data.snippet.framework);
    setVisibility(res.data.snippet.visibility || 'public');
  }
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/snippet/${id}`, {
        title: form.title,
        content: form.content,
        framework: selectedFramework,
        description: form.description,
        visibility: visibility,
      });
      if (res.status === 200) {
        toast.success('Successfully updated');
        setForm({
          title: '',
          content: '',
          description: '',
        });
        setSelectedFramework(undefined);
        setVisibility('public');
      } else {
        toast.error('Something went wrong from our side');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-3xl shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl">Update Code Snippet</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                name="title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter snippet title"
              />
            </div>

            <div className="space-y-2">
              <Label>Framework</Label>
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

            <div className="space-y-2">
              <Label>Code Snippet</Label>
              <Editor
                height="400px"
                defaultLanguage={selectedFramework || 'javascript'}
                value={form.content}
                onChange={(value) => setForm({ ...form, content: value || '' })}
                theme="vs-dark"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Briefly describe your snippet"
              />
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <RadioGroup
                className="flex flex-col gap-2 sm:flex-row sm:gap-6"
                value={visibility}
                onValueChange={(val: Visibility) => setVisibility(val)}
              >
                {visibilityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <option.logo className="w-4 h-4" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="destructive">
                Update Snippet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSnippetPage;
