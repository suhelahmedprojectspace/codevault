import *  as  Ably from 'ably';
import { ChatClient, ChatMessageEvent, Message } from '@ably/chat';

export  const  createAblyClient=()=>{
    const realtimeClient=new Ably.Realtime({
      key:process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId:"user-"+Math.floor(Math.random()*1000),  
    })
    const chatClient=new ChatClient(realtimeClient);
    return chatClient;
}
