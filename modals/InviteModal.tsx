"use client";
import React, { FC, Fragment, useEffect, useState } from "react";
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
import { Check, Copy, RefreshCw } from "lucide-react";
import useOrigin from "@/hooks/useOrigin";
import Loader from "@/components/ui/Loader";



interface InviteModalProps {}
const InviteModal: FC<InviteModalProps> = () => {
  const { isOpen, onClose,onOpen, type,data:{server} } = useModalStore();
  const origin = useOrigin();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [copied,setCopied] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setIsModalOpen(type === "invite" && isOpen);
  }, [type, isOpen]);
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`
  const handleInviteCodeCopy=()=>{
    window.navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(()=>{
        setCopied(false);
    },1000)
    toast.success(`Invite code copied`)
  }
  const onNewGenerateInviteCode = async()=>{
    try{
        setIsLoading(true);
        setApiLoading(true)
        const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
        onOpen("invite",{server:response.data})
        toast.success('New invite code generated')

    }catch(error:any){
        console.log("error : ",error);
        toast.error('Something went wrong')
    }finally{
        setIsLoading(false)
        setApiLoading(false)
    }

  }
  

  return (
    <Fragment>
          <Loader isLoading={apiLoading}/>
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!p-2 text-black bg-white ">
        <DialogHeader className="px-6 pt-8 ">
          <DialogTitle className="!text-2xl font-bold text-center !text-gray-800">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="!p-5">
            <Label className="ml-5 text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                Server Invite Link
            </Label>
            <div className="flex items-center mx-1 mt-2 gap-x-2 md:mx-3">
                <Input className="text-black bg-gray-300 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 " value={inviteUrl} readOnly disabled={isLoading}/>
                <Button size="icon" onClick={handleInviteCodeCopy} disabled={isLoading}>
                    {copied ? <Check className="w-4 h-4 !text-green-500"/>:<Copy className="w-4 h-4"/>}
                </Button>
            </div>
            <Button onClick={onNewGenerateInviteCode} disabled={isLoading} variant="link" size="sm" className="flex mt-4 space-x-4 text-xs text-zinc-500">
                <span className="px-5 ">Generate a new link</span>
                
                <RefreshCw className="w-4 h-4 !mx-3"/>
            </Button>
        </div>
      </DialogContent>
    </Dialog>
    </Fragment>
  );
};

export default InviteModal;
