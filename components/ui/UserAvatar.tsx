"use client";
import React, { FC } from 'react'
import { Avatar,AvatarImage }  from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

interface UserAvatarProps{
    src?:string;
    className:string;
}
const UserAvatar:FC<UserAvatarProps> = ({src,className}):JSX.Element => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10 mr-2",className)}>
        <AvatarImage src={src}/>
    </Avatar>
  )
}

export default UserAvatar