"use client";
import React, { FC } from "react";
import queryString from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";
import ActionTooltip from "@/components/ui/ActionTooltip";
interface ChatVideoButtonProps {}
const ChatVideoButton: FC<ChatVideoButtonProps> = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isVideo = searchParams?.get("video");
  const Icon = isVideo ? VideoOff : Video;
  const toolitipbutton = isVideo ? `End Video Call` : `Start Video Call`;
  const clickHandler = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };
  return (
    <ActionTooltip label={toolitipbutton} side="bottom">
      <button
        onClick={clickHandler}
        className="hover:opacity-75 transition-all mr-4"
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-600" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;
