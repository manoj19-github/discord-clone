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
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/FileUpload";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/hooks/useModalStore";
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";

const formSchema = zod.object({
  name: zod.string().min(1, { message: "Server name is required" }),
  imageUrl: zod.string().min(1, { message: "Server image is required" }),
});

interface EditServerModalProps {}
const EditServerModal: FC<EditServerModalProps> = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModalStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const handleClose = () => {
    form.reset();
    onClose();
  };
  useEffect(() => {
    if (!isOpen) {
      setApiLoading(false);
      form.reset();
      router.refresh();
    }
  }, [isOpen]);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      setApiLoading(true);
      const data = await axios.patch(`/api/servers/${server?.id}`, values);
      toast.success("Your server updated successfully");
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
    setIsModalOpen(type === "editServer" && isOpen);
  }, [type, isOpen]);
  useEffect(() => {
    if (!!server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  return (
    <Fragment>
      <Loader isLoading={apiLoading} />
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="p-0 text-black bg-white ">
          <DialogHeader className="px-6 pt-8 ">
            <DialogTitle className="!text-2xl font-bold text-center !text-gray-800">
              Customize your server
            </DialogTitle>

            <DialogDescription>
              Give your server a personality with a name and an image. You can
              always change it later
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
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                            isLoading={isLoading || apiLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold uppercase text-md text-zinc-500 dark:text-secondary/70">
                        Server Name
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
              </div>
              <DialogFooter className="py-4 bg-gray-200">
                <Button
                  type="submit"
                  disabled={isLoading || apiLoading}
                  variant="primary"
                >
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default EditServerModal;
