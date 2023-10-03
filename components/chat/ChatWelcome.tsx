"use client";
import { Hash } from 'lucide-react';
import React, { FC } from 'react'

interface ChatWelcomeProps{
    type:"channel"|"conversation";
    name:string;
}
const ChatWelcome:FC<ChatWelcomeProps> = ({name,type}):JSX.Element => {
  return (
    <div className="px-4 mb-3 space-x-2">

        {
            type==="channel" ? (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center ">
                    <Hash className='w-12 h-12 text-white'/>

                </div>
            ):(<></>)
        }
        <p className="font-bold text-zl md:text-3xl">
            {type==="channel" ? `Welcome to #`:""}{name}
        </p>
        <p className="text-sm text-zinc-600 dark:zinc-400">
            {type==="channel"?`This is the start of the #${name} channel.`:
                `This is the start of your conversation with ${name}`
            }
        </p>

    </div>
  )
}

export default ChatWelcome