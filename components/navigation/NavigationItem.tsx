"use client";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ui/ActionTooltip";
import Image from "next/image";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

const NavigationItem: FC<NavigationItemProps> = ({
  id,
  imageUrl,
  name,
}): JSX.Element => {
  const params = useParams();
  const router = useRouter();
  const onClickHandler = ()=>{
    router.push(`/servers/${id}`)

  }
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button className="relative flex items-center group " onClick={onClickHandler}>
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id
              ? "group-hover:h-[20px] h-[8px] "
              : "h-[36px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden  ",
            params?.serverId === id
              ? "bg-primary/10 text-primary rounded-[16px] "
              : ""
          )}
        >
          <Image src={imageUrl} alt="channel" fill />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
