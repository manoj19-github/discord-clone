"use client";
import { Member, Message, Profile } from "@prisma/client";
import React, { FC, Fragment,useRef,ElementRef,useState,useEffect } from "react";
import ChatWelcome from "./ChatWelcome";
import ChatItem from "./ChatItem";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash,ChevronDown } from "lucide-react";
import { format } from "date-fns";
import useChatSocket from "@/hooks/useChatSocket";
import useChatScroll from "@/hooks/useChatScroll";
import {LuChevronDown} from "react-icons/lu"


const DATE_FORMAT = "d MMM yyyy,HH:mm";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const ChatMessages: FC<ChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  paramKey,
  paramValue,
  socketQuery,
  type,
}): JSX.Element => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey=`chat:${chatId}:messages:update`
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);


  
  useChatSocket({queryKey,addKey,updateKey})
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

const {distanceFromFooter} = useChatScroll({chatRef,bottomRef,loadMore:fetchNextPage,shouldLoadMore:!isFetchingNextPage && !!hasNextPage,count:data?.pages?.[0]?.items?.length??0})
const scrollToBottom=()=>{
  if(!!bottomRef && bottomRef.current){
    bottomRef.current.scrollIntoView({
      behavior:"smooth"
  })
  }
}

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="w-6 h-6 my-4 text-zinc-500 animate-spin" />
        <p className="text-xs text-zinc-500 dar:text-zinc-400">
          Loading messages ....
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <ServerCrash className="w-6 h-6 my-4 text-zinc-500 " />
        <p className="text-xs text-zinc-500 dar:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }
  return (
    <div ref={chatRef} className="relative flex flex-col flex-1 py-4 overflow-y-auto scrollFeed">
      {!hasNextPage ? <div className="flex-1" /> : <></>}
      {!hasNextPage ?<ChatWelcome type={type} name={name} />:<></> }
      {
        !!hasNextPage ? (
          <div className="flex justify-center">
            {
              isFetchingNextPage ?(
                <Loader2 className="w-6 h-6 my-4 text-zinc-6 animate-spin"/>
              ):(
                <>
                  <button onClick={()=>fetchNextPage()} className="my-4 text-xs transition-all text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 "> Load previous messages</button>
                </>
              )
            }
          </div>
        ):(
        <></>
        )
      }

      <div className="flex flex-col-reverse mt-auto ">
        {data?.pages?.map((group:any, index:number) => (
          <Fragment key={index}>
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdate={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
                member={message.member}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {
          distanceFromFooter>100?  (
          <div onClick={scrollToBottom} className="fixed bottom-[20%] cursor-pointer right-[2%]  bg-[#424242] rounded-full text-white w-8 h-8 flex items-center justify-center ">
            <ChevronDown  className="w-4 h-4 text-zinc-200 " />
        </div>
        ) :(<></>)
      }
     
      <div ref={bottomRef}/>
    </div>
  );  
};

export default ChatMessages;
