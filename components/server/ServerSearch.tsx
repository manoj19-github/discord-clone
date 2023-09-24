"use client";

import { Search } from 'lucide-react';
// import { ChannelType, MemberRole } from '@prisma/client';
// import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import React, { FC, Fragment, KeyboardEvent, ReactNode, useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


interface ServerSearchProps{
    data:{
        label:string;
        type:"channel"|"member",
        data:{
            icon:ReactNode,
            name:string;
            id:string;
        }[] | undefined
    }[]

}

// const IconMap = {
//   [ChannelType.TEXT]:<Hash className='w-4 h-4 mr-2'/>,
//   [ChannelType.AUDIO]:<Mic className='w-4 h-4 mr-2'/>,
//   [ChannelType.VIDEO]:<Video className='w-4 h-4 mr-2'/>
// }
// const RoleIconMap={
//   [MemberRole.GUEST]:null,
//   [MemberRole.MODERATOR]:<ShieldCheck className="w-4 h-4 ml-2 text-indigo-900"/>,
//   [MemberRole.ADMIN]:<ShieldAlert className="w-4 h-4 ml-2 text-indigo-900"/>


// }
const ServerSearch:FC<ServerSearchProps> = (props):JSX.Element => {
  
  const [open,setOpen] = useState<boolean>(false)
  const router = useRouter();
  const params = useParams()
  useEffect(()=>{
    const down = (e:any)=>{
      if(e.key === "k" && (e.metaKey || e.ctrlKey)){
        e.preventDefault();
        setOpen((prev)=>!prev);

      }

    }
    document.addEventListener("keydown",down);
    return()=>{
      document.removeEventListener("keydown",down);
    }
  },[]);
  const handleClickHandler=({id,type}:{id:string,type:'channel'|'member'})=>{
    setOpen(false);
    if(type ==='member'){
      return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
    if(type === 'channel'){
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }
  return (
    <Fragment>
      <button onClick={()=>setOpen(true)} className='flex items-center w-full px-2 py-2 transition-all rounded-md group gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 '>
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400"/>
        <p className="text-sm font-semibold transition-all duration-100 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 ">
          Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className="text-xs">Ctrl</span>+ k
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} >
        <CommandInput placeholder='Search all channels and members'/>
        <CommandEmpty>
          No Result found

        </CommandEmpty>
        {
          props.data.map(({label,type,data},index)=>{
            if(data?.length===0) return null;
            return(
              <CommandGroup key={label} heading={label}>
                {
                  data?.map(({id,icon,name})=>{
                    return(
                      <CommandItem className='cursor-pointer' key={id} onSelect={()=>handleClickHandler({id,type})}>
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    )
                  })
                }
              </CommandGroup>

            )
          })
        }
      </CommandDialog>
    </Fragment>
  )
}

export default ServerSearch