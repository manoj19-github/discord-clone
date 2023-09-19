"use client";
import { ServerWithMemberWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { FC } from "react";
import { ChevronDown, ChevronRight, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModalStore } from "@/hooks/useModalStore";

interface ServerHeaderProps {
  server: ServerWithMemberWithProfiles;
  role?: MemberRole;
}
const ServerHeader: FC<ServerHeaderProps> = ({ server, role }): JSX.Element => {
  const {onOpen} = useModalStore();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none " asChild>
        <button className="flex items-center w-full h-12 px-3 font-semibold transition-all duration-200 ease-in border-b-2 text-md border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="w-5 h-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isAdmin ? (
          <DropdownMenuItem className="px-5 py-2 text-sm text-indigo-600 cursor-pointer dark:text-indigo-400" onClick={()=>onOpen("invite",{server})}>
            
            Invite People
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <></>
        )}

        {isAdmin ? (
          <DropdownMenuItem className="px-5 py-2 text-sm cursor-pointer " onClick={()=>onOpen("editServer",{server})}>
            
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <></>
        )}
         {isAdmin ? (
          <DropdownMenuItem className="px-5 py-2 text-sm cursor-pointer "  onClick={()=>onOpen("members",{server})}>
     
                Manage Members
                <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <></>
        )}
           {isAdmin || isModerator ? (
          <DropdownMenuItem className="px-5 py-2 text-sm cursor-pointer ">
     
                Create Channel
                <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <></>
        )}
        {isAdmin || isModerator  ? (
                <DropdownMenuSeparator/>
        ) : (
          <></>
        )}
        {isAdmin ? (
          <DropdownMenuItem className="px-5 py-2 text-sm cursor-pointer text-rose-500 ">
     
               Delete Server
                <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <></>
        )}
         {!isAdmin ? (
          <DropdownMenuItem className="px-5 py-2 text-sm cursor-pointer text-rose-500 ">
     
               Leave Server
                <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        ) : (
          <></>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
