import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/ui/MediaRoom";
import { currentProfile } from "@/lib/currentProfile";
import getCurrentMemeber from "@/serverActions/getCurrentMember";
import getOrCreateConversationForOneToOne from "@/serverActions/getOrCreateConversationForOneToOne";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC, Fragment } from "react";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({
  params,
  searchParams,
}) => {
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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full scrollFeed">
      <ChatHeader
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        serverId={params.serverId}
        name={otherMember.profile.name}
      />
      {!searchParams?.video ? (
        <Fragment>
          <ChatMessages
            name={otherMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            apiUrl={"/api/pdirect-messages"}
            socketUrl={"/api/socket/direct-messages"}
            socketQuery={{
              conversationId: conversation.id,
              currentMember: currentMember.id,
            }}
            paramKey={"conversationId"}
            paramValue={conversation.id}
            type={"conversation"}
          />
          <ChatInput
            apiUrl={"/api/socket/direct-messages"}
            query={{
              conversationId: conversation.id,
              currentMember: currentMember.id,
            }}
            name={otherMember.profile.name}
            type={"conversation"}
          />
        </Fragment>
      ) : (
        <></>
      )}
      {searchParams?.video ? (
        <MediaRoom chatId={conversation.id} audio={true} video={true} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MemberIdPage;
