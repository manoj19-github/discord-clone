import { currentProfile } from '@/lib/currentProfile'

import { redirect } from 'next/navigation';
import React, { FC } from 'react'
import getServerByIdWithChannelAndMembers from '@/serverActions/getServerByIdWithChannelAndMembers.action';
import { ChannelType } from '@prisma/client';
import ServerHeader from './ServerHeader';

interface ServerSidebarProps {
    serverId:string
}
const ServerSidebar:FC<ServerSidebarProps> = async({serverId}) => {
   
    const profile = await currentProfile();
   
    if(!profile) return redirect("/");
    const serverWithChannelAndMembers  =  await getServerByIdWithChannelAndMembers(serverId)

    if(!serverWithChannelAndMembers) return redirect("/")

    const textChannels = serverWithChannelAndMembers?.channels.filter((self)=>self.type===ChannelType.TEXT)
    const audioChannels = serverWithChannelAndMembers?.channels.filter((self)=>self.type===ChannelType.AUDIO)
    const videoChannels = serverWithChannelAndMembers?.channels.filter((self)=>self.type===ChannelType.VIDEO)
    const members = serverWithChannelAndMembers?.members.filter((self)=>self.profileId !==profile.id)
    const role = serverWithChannelAndMembers.members.find((self)=>self.profileId === profile.id)?.role;

    


    return <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-gray-300 '>
        <ServerHeader server={serverWithChannelAndMembers} role={role}/>
    </div>
  
}

export default ServerSidebar