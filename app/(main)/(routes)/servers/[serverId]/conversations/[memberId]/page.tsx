import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { currentProfile } from "@/lib/currentProfile";
import getCurrentMemeber from "@/serverActions/getCurrentMember";
import getOrCreateConversationForOneToOne from "@/serverActions/getOrCreateConversationForOneToOne";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await getCurrentMemeber(params.serverId, profile.id);
  if (!currentMember) return redirect("/");
  const conversation = await getOrCreateConversationForOneToOne(
    currentMember.id,
    params.memberId
  );
  if (!conversation) return redirect(`/servers/${params.serverId}`);
  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
   
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        serverId={params.serverId}
        name={otherMember.profile.name}
      />
      <ChatMessages
        name={otherMember.profile.name}
        member={currentMember}
        chatId={conversation.id}
        apiUrl={"/api/direct-messages"}
        socketUrl={"/api/socket/direct-messages"}
        socketQuery={{
          conversationId: conversation.id,
          currentMember:currentMember.id,
        }}
        paramKey={"conversationId"}
        paramValue={conversation.id}
        type={"conversation"}
      />
      <ChatInput 
        apiUrl={"/api/socket/direct-messages"}
        query={{
          conversationId:conversation.id,
          currentMember:currentMember.id,
        }} 
        name={otherMember.profile.name} 
        type={"conversation"} 

      />
    </div>
  );
};

export default MemberIdPage;
