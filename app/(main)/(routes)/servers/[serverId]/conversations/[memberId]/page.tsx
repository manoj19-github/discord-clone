import ChatHeader from "@/components/chat/ChatHeader";
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
    </div>
  );
};

export default MemberIdPage;
