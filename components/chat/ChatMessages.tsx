"use client";
import { Member, Message, Profile } from "@prisma/client";
import React, { FC, Fragment } from "react";
import ChatWelcome from "./ChatWelcome";
import ChatItem from "./ChatItem";
import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import { format } from "date-fns";
import useChatSocket from "@/hooks/useChatSocket";

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
  useChatSocket({queryKey,addKey,updateKey})
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
    
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
  console.log("messages : ", data);
  return (
    <div className="flex flex-col flex-1 py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />

      <div className="flex flex-col-reverse mt-auto">
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
    </div>
  );
};

export default ChatMessages;
