import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/ui/MediaRoom";
import { currentProfile } from "@/lib/currentProfile";
import getChannelById from "@/serverActions/getChannelById";
import getMemberByServerAndProfile from "@/serverActions/getMemberByServerAndProfile";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { FC, Fragment } from "react";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}
const ChannelsPage: FC<ChannelIdPageProps> = async ({ params }) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const channel = await getChannelById(params.channelId);
  const member = await getMemberByServerAndProfile(params.serverId, profile.id);
  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT ? (
        <Fragment>
          <ChatMessages
            member={member}
            name={channel.name}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            chatId={channel.id}
          />
          <ChatInput
            query={{ channelId: channel.id, serverId: channel.serverId }}
            apiUrl={"/api/socket/messages"}
            name={channel.name}
            type={"channel"}
          />
        </Fragment>
      ) : (
        <></>
      )}
      {
        channel.type === ChannelType.AUDIO ? (
          <MediaRoom 
            chatId={channel.id}
            video={false}
            audio={true}
          />
        ):(
          <></>
        )
      }
      {
        channel.type === ChannelType.VIDEO ? (
          <MediaRoom 
            chatId={channel.id}
            video={true}
            audio={true}
          />
        ):(
          <></>
        )
      }
    </div>
  );
};
export default ChannelsPage;
