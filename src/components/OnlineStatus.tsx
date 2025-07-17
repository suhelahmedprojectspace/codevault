"use client";

import { useEffect, useState } from "react";
import { getAblyClient } from "@/lib/ablyRealtime";

export default function OnlineStatus({
  userId,
  option,
}: {
  userId: string;
  option?: string;
}) {
  const [isOnline, setIsOnline] = useState(false);
  const ably = getAblyClient();

  useEffect(() => {
    const channel = ably.channels.get(`[?rewind=1]presence:status`);

    const onEnter = (member: any) => {
      if (member.clientId === userId) setIsOnline(true);
    };
    const onLeave = (member: any) => {
      if (member.clientId === userId) setIsOnline(false);
    };

    channel.presence.subscribe("enter", onEnter);
    channel.presence.subscribe("leave", onLeave);

    channel.presence.get().then((members) => {
      setIsOnline(
        members.some((member) => member.clientId === userId)
      );
    });

    return () => {
      channel.presence.unsubscribe("enter", onEnter);
      channel.presence.unsubscribe("leave", onLeave);
    };
  }, [userId]);

  return (
    <>
      {option ? (
        <span
          className={`text-xs font-medium text-foreground ${
            isOnline ? "text-green-600" : "text-red-500"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      ) : (
        <div
          className={`w-3 h-3 rounded-full absolute top-6 z-10 ${
            isOnline ? "bg-green-400" : "bg-red-500"
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
      )}
    </>
  );
}
