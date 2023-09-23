"use client";
import React, { FC, Fragment, useEffect, useState } from "react";
import qs from "query-string"
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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import { SelectValue } from "@radix-ui/react-select";
import Loader from "@/components/ui/Loader";

const formSchema = zod.object({
  name: zod
    .string()
    .min(1, { message: "Channel name is required" })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general'",
    }),
  type: zod.nativeEnum(ChannelType),
});

interface CreateChannelModalProps {}
const CreateChannelModal: FC<CreateChannelModalProps> = () => {

  const { isOpen, onClose, type } = useModalStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });
  const handleClose = () => {
    form.reset();
    onClose();
  };
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      setApiLoading(true);
      const url = qs.stringifyUrl({
        url:`/api/channels`,
        query:{
            serverId:params?.serverId
        }

      })
      const data = await axios.post(url, values);
      form.reset();
      toast.success("New server created successfully");
      handleClose();
      router.refresh();
    } catch (error) {
      console.log("error : ", error);
      toast.error("Something went wrong");
    } finally {
      setApiLoading(false);
    }
  };
  useEffect(() => {
    setIsModalOpen(type === "createChannel" && isOpen);
  }, [type, isOpen]);

  return (
    <Fragment>
      <Loader isLoading={apiLoading}/>
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      
      <DialogContent className="p-0 text-black bg-white ">
        <DialogHeader className="px-6 pt-8 ">
          <DialogTitle className="!text-2xl font-bold text-center !text-gray-800">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="!py-5 !mt-5 space-y-8"
          >
            <div className="px-6 !py-8 !space-y-8  my-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold uppercase text-md text-zinc-500 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading || apiLoading}
                        readOnly={isLoading || apiLoading}
                        className="text-black bg-white border border-gray-200 focus-visible:rinc-0 focus-visible:ring-offset-0"
                        placeholder="Enter Server Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none  ">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                    </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((self) => (
                            <SelectItem
                              key={self}
                              value={self}
                              className="capitalize"
                            >
                              {self.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
              
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="py-4 bg-gray-200">
              <Button
                type="submit"
                disabled={isLoading || apiLoading}
                variant="primary"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </Fragment>
  );
};

export default CreateChannelModal;
