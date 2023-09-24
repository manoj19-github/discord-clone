"use client"
import { MemberRole } from '@prisma/client';
import React, { FC } from 'react'
import { ChannelType } from '@prisma/client';
import { ServerWithMemberWithProfiles } from '@/types';
import ActionTooltip from '../ui/ActionTooltip';
import { Plus, Settings } from 'lucide-react';
import { useModalStore } from '@/hooks/useModalStore';
interface ServerSectionProps{
    label:string;
    role?:MemberRole;
    channelType?:ChannelType;
    server?:ServerWithMemberWithProfiles;
    sectionType:"channels"|"members"
}
const ServerSection:FC<ServerSectionProps> = ({
    label,
    role,
    sectionType,
    channelType,
    server
}):JSX.Element => {
    const {onOpen} = useModalStore()
  return (
    <div className='flex items-center justify-between py-2'>
        <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
            {label}
        </p>
        {
            role !== MemberRole.GUEST && sectionType === "channels" ?(
                <ActionTooltip label="Create Channel" side="top">
                    <button onClick={()=>onOpen("createChannel")} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 '>
                        <Plus className="w-4 h-4"/>
                    </button>


                </ActionTooltip>
            ):(<></>)
        }
        {
            role === MemberRole.ADMIN && sectionType === "members" ?(
                <ActionTooltip label="Create Channel" side="top">
                    <button onClick={()=>onOpen("members",{server})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 '>
                        <Settings className="w-4 h-4"/>
                    </button>


                </ActionTooltip>


            ):(
                <></>
            )
        }
    </div>
  )
}

export default ServerSection