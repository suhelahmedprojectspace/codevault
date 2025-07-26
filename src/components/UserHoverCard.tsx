'use client';
import React, { useState, useEffect } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const UserHoverCard = ({ name, email, image }: { email: string; name: string; image: string }) => {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link">{name}</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <Avatar className="flex items-center">
          <AvatarImage src={`${image}`} />
          <AvatarFallback className="bg-blue-500 text-white rounded-full p-2 text-center font-semibold">
            {initials}
          </AvatarFallback>

          <div className="flex flex-col text-sm font-semibold ms-3">
            <p>{name}</p>
            <p>{email}</p>
            {/* <div>
                //use logo if neccessay social links
                       <Github/>
                </div> */}
          </div>
        </Avatar>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserHoverCard;
