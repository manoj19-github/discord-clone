"use client";
import React, { FC, Fragment, useEffect, useState } from "react";
import axios from "axios";
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
import { useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import Loader from "@/components/ui/Loader";




interface DeleteServerProps {}
const DeleteServer: FC<DeleteServerProps> = () => {
  const router = useRouter();
  const { isOpen, onClose,onOpen, type,data:{server} } = useModalStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [copied,setCopied] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setIsModalOpen(type === "deleteServer" && isOpen);
  }, [type, isOpen]);

  const onLeaveServerHandler = async()=>{
    try{
        setApiLoading(true)
        const servers=await axios.delete(`/api/servers/${server?.id}`);
        handleClose();
        router.refresh();
        router.push("/")
   

        
        
        toast.success('Leave Server successfully')


    }catch(error:any){
        console.log("error : ",error);
        toast.error('Something went wrong')
    }finally{
        setApiLoading(false)
    }

  }
  useEffect(()=>{
    if(!isOpen){
      setApiLoading(false)
      router.refresh();
    }

  },[isOpen])
  

  return (
    <Fragment>
    <Loader isLoading={apiLoading}/>
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!p-2 text-black bg-white ">
        <DialogHeader className="px-6 pt-8 ">
          <DialogTitle className="!text-2xl font-bold text-center !text-gray-800">
            Delete Server
       
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br/>
            <span style={{color:"#7275f2"}} className="!text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 pt-5">
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

export default DeleteServer;
