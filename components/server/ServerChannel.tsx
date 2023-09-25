"use client";
import { cn } from "@/lib/utils";
import { ServerWithMemberWithProfiles } from "@/types";
import { Channel, ChannelType, MemberRole } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import React, { FC } from "react";
import ActionTooltip from "../ui/ActionTooltip";

interface ServerChannelProps {
  channel: Channel;
  server: ServerWithMemberWithProfiles;
  role?: MemberRole;
}

const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel: FC<ServerChannelProps> = ({
  channel,
  server,
  role,
}): JSX.Element => {
  const router = useRouter();
  const params = useParams();
  const Icon = IconMap[channel.type];
  return (
    <button
      onClick={() => {}}
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full  dark:bg-zinc-700/50 transition mb-5  ",
        params?.channelId === channel.id ? "bg-zinc-700/20 dark:bg-zinc-700":""
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-500" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-all duration-100 ease-in",
          params?.channelId === channel.id
            ? "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            : ""
        )}
      >
        {channel.name}
      </p>
      {
        channel.name !=="general" && role !== MemberRole.GUEST ? (
            <div className="flex items-center ml-auto gap-x-2">
                <ActionTooltip label="Edit">
                    <Edit className="hidden w-4 h-4 transition-all duration-200 group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"/>

                </ActionTooltip>
                <ActionTooltip label="Delete">
                    <Trash className="hidden w-4 h-4 transition-all duration-200 group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"/>

                </ActionTooltip>
            </div>

        ):(<></>)
      }
      {
        channel.name ==="general" ? (
            <Lock className="w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400 "/>

        ):(<></>)
      }

    </button>
  );
};

export default ServerChannel;
