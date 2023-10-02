"use client";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, Copy, Gavel, Loader, MoreVertical, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { ServerWithMemberWithProfiles } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string"

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-5 h-5 !ml-5 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-5 h-5 !ml-5 text-rose-500" />,
};

interface MembersModalProps {}
const MembersModal: FC<MembersModalProps> = () => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string>("");
  const { isOpen, onClose, onOpen, type, data } = useModalStore();
  const { server } = data as { server: ServerWithMemberWithProfiles };
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setIsModalOpen(type === "members" && isOpen);
  }, [type, isOpen]);



  const onNewGenerateInviteCode = async () => {
    try {
      setIsLoading(true);
      setApiLoading(true)
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
      toast.success("New invite code generated");
    } catch (error: any) {
      console.log("error : ", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setApiLoading(false)
    }
  };
  const onRoleChange = async(memberId:string,role:MemberRole)=>{
    try{
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id
        }
      });
      const response = await axios.patch(url,{role});
      router.refresh();
      onOpen("members",{server:response.data})
    }catch(error){
      console.log("error : ",error);

    }finally{
      setLoadingId("");
    }


  }
  const onKickHandler = async(memberId:string)=>{
    try{
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId:server?.id
        }
      });
      const response = await axios.delete(url);
      router.refresh();
      onOpen("members",{server:response.data})
    }catch(error){
      console.log("error : ",error);

    }finally{
      setLoadingId("");
    }


  }




  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!p-2 text-black bg-white ">
        <DialogHeader className="px-6 pt-8 ">
          <DialogTitle className="!text-2xl font-bold text-center !text-gray-800">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-5 max-h-[420px] pr-5">
          {server?.members?.map((self) => (
            <div key={self.id} className="flex items-center mb-5 gap-x-2">
              <UserAvatar className={""} src={self.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center justify-around   !gap-5 text-xs font-semibold ">
                  <div>{self.profile.name}</div>
                  {roleIconMap[self.role]}
                </div>
                <p className="!mt-3 text-xs text-zinc-600">
                  {self.profile.email}
                </p>
              </div>
              {server?.profileId !== self.profileId && loadingId !== self.id ? (
                <div className="ml-auto mr-1 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4 text-zinc-600"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center ">
                          <ShieldQuestion className="w-4 h-4 mr-2"/>
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={()=>onRoleChange(self.id,"GUEST")}>
                              <Shield className="w-4 h-4 mr-2"/>
                              Guest
                              {self.role === "GUEST" ? (<Check className="w-4 h-4 ml-auto"/>):(<></>)}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>onRoleChange(self.id, "MODERATOR" )}>
                              <ShieldCheck className="w-4 h-4 mr-2"/>
                              Moderator
                              {self.role === "MODERATOR" ? (<Check className="w-4 h-4 ml-auto"/>):(<></>)}
                            </DropdownMenuItem>
                            
                          </DropdownMenuSubContent>


                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem onClick={()=>onKickHandler(self.id)}>
                        <Gavel className="w-4 h-4 mr-2 "/>
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>

                  </DropdownMenu>
                </div>
              ) : (
                <></>
              )}
              {
                loadingId ===self.id ? <Loader className="w-4 h-4 ml-auto animate-spin text-zinc-900"/>:<></>
              }
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
