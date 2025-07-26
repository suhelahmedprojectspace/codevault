'use client';
import { useEffect, useState } from 'react';
import MySnippets from './mycode/page';
import SharedSnippetsPage from './sharedcode/page';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';

const SnippetsPage = () => {
  const [mysnippet, setMysnippet] = useState('');
  const [sharedsnippet, setSharedSnippet] = useState('');
  useEffect(() => {
    const fetchSnippetLength = async () => {
      const res = await axios.get('/snippet');
      setMysnippet(res.data.user.snippetCollection);
      setSharedSnippet(res.data.user.allowedSnippets);
    };
    fetchSnippetLength();
  }, []);
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Code Snippets
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize and manage your reusable code snippets
          </p>
        </div>
        <Link href="/dashboard/snippet/createcode">
          <Button className="gap-2 shadow-sm hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            Create New
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="mycode" className="w-full">
          <div className="flex flex-col gap-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md bg-muted p-1 rounded-lg h-12">
              <TabsTrigger
                value="mycode"
                className="rounded-md py-2 font-medium transition-all data-[state=active]:shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span>Personal Snippets</span>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    {mysnippet.length}
                  </span>
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="sharedcode"
                className="rounded-md py-2 font-medium transition-all data-[state=active]:shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <span>Shared Snippets</span>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    {sharedsnippet.length || '0'}
                  </span>
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <TabsContent value="mycode" className="m-0">
                <MySnippets />
              </TabsContent>
              <TabsContent value="sharedcode" className="m-0">
                <SharedSnippetsPage />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SnippetsPage;
