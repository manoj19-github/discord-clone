import getAllServerByProfileId from "@/app/serverActions/getAllServerByProfile.action";
import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "../ToggleDark";
import { UserButton } from "@clerk/nextjs";

interface NavigationSidebarProps {}
const NavigationSidebar: FC<NavigationSidebarProps> = async () => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");
  const servers = await getAllServerByProfileId(profile.id);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-gray-400 dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-400 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers?.map((self, index) => (
          <div key={index} className="mb-5">
            <NavigationItem
              id={self.id}
              imageUrl={self.imageUrl}
              name={self.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <ModeToggle/>
        <UserButton afterSignOutUrl="/" appearance={{
            elements:{
                avatarBox:"h-[40px] w-[40px]" 
            }
        }}/>
      </div>
    </div>
  );
};

export default NavigationSidebar;
