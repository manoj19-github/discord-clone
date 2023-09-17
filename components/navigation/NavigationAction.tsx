"use client";

import { Plus } from "lucide-react";
import React, { FC } from "react";
import ActionTooltip from "../ui/ActionTooltip";
import { useModalStore } from "@/hooks/useModalStore";

interface NavigationActionProps {}
const NavigationAction: FC<NavigationActionProps> = (): JSX.Element => {
    const {onOpen} = useModalStore()
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button className="flex items-center group" onClick={()=>onOpen("createServer")}>
          <div className="flex mx-3 w-[48px] py-3 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden duration-300 items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500  ">
            <Plus
              className="transition group-hover:text-white text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
