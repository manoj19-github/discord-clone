"use client";
import React, { FC, Fragment, useEffect, useState } from "react";
import axios from "axios";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertTriangle } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { useModalStore } from "@/hooks/useModalStore";
import queryString from "query-string";

const formSchema = zod.object({
  fileUrl: zod.string().min(1, { message: "Attachement is required" }),
});

interface MessageFileModalProps {}
const MessageFileModal: FC<MessageFileModalProps> = () => {
  const {isOpen,onClose,type,onOpen,data} = useModalStore();
  const {apiUrl,query} = data;
  const router = useRouter();
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      setApiLoading(true);
      const url = queryString.stringifyUrl({
        url:apiUrl || "",
        query
      })
      const data = await axios.post(url, {
        ...values,
        content:values.fileUrl
      });
      form.reset();
      router.refresh();
      onClose();
      toast.success("attachment sent");
    } catch (error: any) {
      console.log("error : ", error);
      toast.error("Something went wrong");
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    setModalOpen(type === "messageFile" && isOpen);
  }, [type, isOpen]);

  useEffect(()=>{
    if(!isOpen){
      setApiLoading(false);
      form.reset();
      router.refresh();
    }

  },[isOpen])

  const handleClose = () => {
    if(apiLoading) return;
    form.reset();
    onClose();
  };

  

  return (
    <Fragment>
    <Loader isLoading={apiLoading} />
    <Dialog open={modalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 text-black bg-white ">
        <DialogHeader className="px-6 pt-8 ">
          <DialogTitle className="!text-2xl font-bold text-center !text-gray-800">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-center">
            Send a file as a message
          </DialogDescription>

   
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="!py-5 !mt-5 space-y-8"
          >
            <div className="px-6 !py-8 !space-y-8  my-5">
            
              <div className="flex items-center justify-center !my-8 text-center ">
              
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={(res)=>{console.log("res",res);field.onChange(res)}}
                          isLoading={apiLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="py-4 bg-gray-200">
              <Button type="submit" disabled={apiLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </Fragment>
  );
};

export default MessageFileModal;
