import { currentProfile } from "@/lib/currentProfile";

import { redirect } from "next/navigation";
import React, { FC } from "react";
import getServerByIdWithChannelAndMembers from "@/serverActions/getServerByIdWithChannelAndMembers.action";
import { ChannelType, MemberRole } from "@prisma/client";
import ServerHeader from "./ServerHeader";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./ServerSearch";
import { Hash, Mic, Video, ShieldCheck, ShieldAlert } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./ServerSection";
import ServerChannel from "./ServerChannel";
import { channel } from "diagnostics_channel";

interface ServerSidebarProps {
  serverId: string;
}
const IconMap = {
  [ChannelType.TEXT]: <Hash className="w-4 h-4 mr-2" />,
  [ChannelType.AUDIO]: <Mic className="w-4 h-4 mr-2" />,
  [ChannelType.VIDEO]: <Video className="w-4 h-4 mr-2" />,
};
const RoleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 ml-2 text-indigo-900" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};
const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");
  const serverWithChannelAndMembers = await getServerByIdWithChannelAndMembers(
    serverId
  );

  if (!serverWithChannelAndMembers) return redirect("/");

  const textChannels = serverWithChannelAndMembers?.channels.filter(
    (self) => self.type === ChannelType.TEXT
  );
  const audioChannels = serverWithChannelAndMembers?.channels.filter(
    (self) => self.type === ChannelType.AUDIO
  );
  const videoChannels = serverWithChannelAndMembers?.channels.filter(
    (self) => self.type === ChannelType.VIDEO
  );
  const members = serverWithChannelAndMembers?.members.filter(
    (self) => self.profileId !== profile.id
  );
  const role = serverWithChannelAndMembers.members.find(
    (self) => self.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-gray-300 ">
      <ServerHeader server={serverWithChannelAndMembers} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((self) => ({
                  id: self.id,
                  name: self.name,
                  icon: IconMap[self.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels?.map((self) => ({
                  id: self.id,
                  name: self.name,
                  icon: IconMap[self.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((self) => ({
                  id: self.id,
                  name: self.name,
                  icon: IconMap[self.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((self) => ({
                  id: self.id,
                  name: self.profile.name,
                  icon: RoleIconMap[self.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        {!!textChannels?.length ? (
          <div className="my-2">
            <ServerSection
              label={"Text Channels"}
              channelType={ChannelType.TEXT}
              sectionType={"channels"}
              role={role}
            />
            {textChannels.map((self, index) => (
              <ServerChannel
                key={index}
                channel={self}
                server={serverWithChannelAndMembers}
                role={role}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
         {!!audioChannels?.length ? (
          <div className="my-2">
            <ServerSection
              label={"Audio Channels"}
              channelType={ChannelType.AUDIO}
              sectionType={"channels"}
              role={role}
            />
            {audioChannels.map((self, index) => (
              <ServerChannel
                key={index}
                channel={self}
                server={serverWithChannelAndMembers}
                role={role}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
         {!!videoChannels?.length ? (
          <div className="my-2">
            <ServerSection
              label={"Video Channels"}
              channelType={ChannelType.VIDEO}
              sectionType={"channels"}
              role={role}
            />
            {videoChannels.map((self, index) => (
              <ServerChannel
                key={index}
                channel={self}
                server={serverWithChannelAndMembers}
                role={role}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
