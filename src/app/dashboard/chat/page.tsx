'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OnlineStatus from '@/components/OnlineStatus';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquareMore, SendHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAblyClient } from '@/lib/ablyRealtime';
import { useSession } from 'next-auth/react';

interface CodeBuddy {
  id?: string;
  username: string;
  email: string;
  image: string | null;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'buddy';
  timestamp: Date;
}

const Page = () => {
  const { data: session } = useSession();
  const [buddy, setBuddy] = useState<CodeBuddy | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBuddyTyping, setIsBuddyTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getChatChannelName = (id1: string, id2: string) =>
    `chat:${[id1, id2].sort().join('-')}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/chat/codebuddy');
        const buddyInfo = res.data?.userWithBuddy?.codeBuddy;

        if (buddyInfo) {
          setBuddy({
            id: buddyInfo.id,
            username: buddyInfo.username,
            email: buddyInfo.email,
            image: buddyInfo.image ?? '/default-avatar.png',
          });

          const messagesRes = await axios.get(
            `/chat?userId1=${session?.user.id}&userId2=${buddyInfo.id}`
          );
          const raw = messagesRes.data.data;

          setMessages(
            raw.map((msg: any) => ({
              id: msg.id,
              content: msg.content,
              sender: msg.senderId === session?.user.id ? 'user' : 'buddy',
              timestamp: new Date(msg.timestamp),
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (session?.user?.id) fetchData();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!buddy || !session?.user?.id) return;

    const ably = getAblyClient();
    const channelName = getChatChannelName(session.user.id, buddy.id!);
    const channel = ably.channels.get(channelName);

    const handleMessage = (message: any) => {
      const data = message.data;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.content,
          sender: data.senderId === session?.user.id ? 'user' : 'buddy',
          timestamp: new Date(data.timestamp),
        },
      ]);
    };

    const handleTyping = (message: any) => {
      if (message.data.senderId !== session?.user?.id) {
        setIsBuddyTyping(true);
        setTimeout(() => setIsBuddyTyping(false), 2000);
      }
    };

    channel.subscribe('message', handleMessage);
    channel.subscribe('typing', handleTyping);

    return () => {
      channel.unsubscribe('message', handleMessage);
      channel.unsubscribe('typing', handleTyping);
    };
  }, [buddy, session?.user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !buddy || !session?.user?.id) return;

    try {
      const ably = getAblyClient();
      const channelName = getChatChannelName(session.user.id, buddy.id!);
      const channel = ably.channels.get(channelName);

      const payload = {
        content: input,
        senderId: session.user.id,
        recipientId: buddy.id,
        timestamp: new Date().toISOString(),
      };

      channel.publish('message', payload);
      await axios.post('/chat', payload);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (!value.trim() || !buddy || !session?.user?.id) return;

    const ably = getAblyClient();
    const channelName = getChatChannelName(session.user.id, buddy.id!);
    const channel = ably.channels.get(channelName);
    channel.publish('typing', { senderId: session.user.id });
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="shadow-sm rounded border p-4 flex items-center gap-3 sticky top-0 bg-background z-10">
        {buddy ? (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.image || '/default-avatar.png'} alt={buddy.username} />
              <AvatarFallback>{buddy.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <h2 className="font-semibold truncate">{buddy.username}</h2>
              {buddy.id && <OnlineStatus userId={buddy.id} option="text" />}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 
              ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 text-right ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

      
       {buddy && isBuddyTyping ? (
  <div className="flex items-center gap-2 px-2">
     <Avatar className="h-10 w-10">
              <AvatarImage src={buddy.image || '/default-avatar.png'} alt={buddy.username} />
              <AvatarFallback>{buddy.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
    </div>
  </div>
):null}

        <div ref={messagesEndRef} />
      </main>

      <footer className="sticky bottom-0 bg-background p-2">
        <div className="flex gap-1 items-center">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Page;
