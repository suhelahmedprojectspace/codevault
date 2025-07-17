"use client";

import { useEffect } from "react";
import { getAblyClient } from "@/lib/ablyRealtime";
import { useSession } from "next-auth/react";

export default function PresenceSetter() {
  const { data: session } = useSession();
  const ably=getAblyClient();
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channel = ably.channels.get(`[?rewind=1]presence:status`);
    
    // Enter presence with user ID in data
    channel.presence.enter({ userId: session.user.id });
    
    return () => {
      channel.presence.leave();
    };
  }, [session]);
  
  return null;
}