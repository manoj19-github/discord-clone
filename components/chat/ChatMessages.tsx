"use client";
import { Member } from '@prisma/client';
import React, { FC } from 'react'
import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';

interface ChatMessagesProps{
    name:string;
    member:Member;
    chatId:string;
    apiUrl:string;
    socketUrl:string;
    socketQuery:Record<string,string>;
    paramKey:"channelId"|"conversationId";
    paramValue:string;
    type:"channel"|"conversation"
    

}

const ChatMessages:FC<ChatMessagesProps> = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    paramKey,
    paramValue,
    socketQuery,
    type
}):JSX.Element => {
  const queryKey = `chat:${chatId}`
  const {

    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status

  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue

  });
  if(status==='loading'){
    return(
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className='w-6 h-6 my-4 text-zinc-500 animate-spin'/>
        <p className="text-xs text-zinc-500 dar:text-zinc-400">
          Loading messages ....
        </p>
      </div>
    )
  }
  if(status==='error'){
    return(
      <div className="flex flex-col items-center justify-center flex-1">
        <ServerCrash className='w-6 h-6 my-4 text-zinc-500 '/>
        <p className="text-xs text-zinc-500 dar:text-zinc-400">
          Something went wrong
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <div className="flex-1">
            <ChatWelcome type={type} name={name}/>
        </div>

    </div>
  )
}

export default ChatMessages