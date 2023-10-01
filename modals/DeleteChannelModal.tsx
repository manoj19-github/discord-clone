"use client";
import React, { FC, Fragment, useEffect, useState } from "react";
import axios from "axios";
import qs from "query-string"
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import Loader from "@/components/ui/Loader";




interface DeleteChannelProps {}
const DeleteChannel: FC<DeleteChannelProps> = () => {
  const router = useRouter();
  const params = useParams()
  const { isOpen, onClose,onOpen, type,data:{server,channel} } = useModalStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [copied,setCopied] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setIsModalOpen(type === "deleteChannel" && isOpen);
  }, [type, isOpen]);

  const onLeaveServerHandler = async()=>{
    try{
        setApiLoading(true);
        const url = qs.stringifyUrl({
           url:`/api/channels/${channel?.id}` ,
           query:{
            serverId:params?.serverId
           }
        })
        const servers=await axios.delete(url);
        handleClose();
        router.refresh();
        router.push(`/servers/${params?.serverId}`)
        toast.success('Channel deleted successfully')


    }catch(error:any){
        console.log("error : ",error);
        toast.error('Something went wrong')
    }finally{
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
            Delete Channel
       
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br/>
            <span style={{color:"#7275f2"}} className="!text-indigo-500 font-semibold">#{channel?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 pt-5 bg-gray-100">
          <div className="flex items-center justify-between w-full">
            <Button 
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button 
              disabled={isLoading}
              variant="primary"
              onClick={onLeaveServerHandler}
            >
              Confirm

            </Button>

          </div>

        </DialogFooter>

      </DialogContent>
    </Dialog>
    </Fragment>
  );
};

export default DeleteChannel;
