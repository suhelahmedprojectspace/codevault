'use client';

import { ChevronRight, Code, Search, Settings, Inbox, Calendar, NotebookPen } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';

const items = [
  {
    title: 'Code',
    icon: Code,
    data: [
      { title: 'Create', action: 'showCreateCode' },
      { title: 'View All Snippets', action: 'viewSnippets' },
      { title: 'Edit Snippets', action: 'editSnippets' },
    ],
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
  },
  {
    title: 'Blogs',
    url: '#',
    icon: NotebookPen,
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export function AppSideBar({ setActiveView }: { setActiveView: (view: string) => void }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="text-xl ml-2 font-semibold text-indigo-600">
        CodeVault
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {items.map((item) => (
          <Collapsible key={item.title} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel className="group/label hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <CollapsibleTrigger className="flex p-2 items-center w-full cursor-pointer">
                  <div className="flex items-center">
                    <item.icon />
                    <span className="ml-2 leading-tight text-sm font-semibold">{item.title}</span>
                  </div>
                  {item.data ? (
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  ) : null}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.data?.map((data) => (
                      <SidebarMenuItem key={data.title}>
                        <SidebarMenuButton asChild onClick={() => setActiveView(data.action || '')}>
                          <a href="#" className=" p-4 font-semibold">
                            {data.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
