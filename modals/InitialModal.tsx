"use client";
import React, { FC, useEffect, useState } from "react";
import axios from "axios"
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

const formSchema = zod.object({
  name: zod.string().min(1, { message: "Server name is required" }),
  imageUrl: zod.string().min(1, { message: "Server image is required" }),
});

interface InitialModalProps {}
const InitialModal: FC<InitialModalProps> = () => {
  const router  = useRouter();
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    const data = await axios.post("/api/servers",values)
    form.reset();
    router.refresh();
    window.location.reload();

    console.log("values : ", values);
  };

  useEffect(() => {
    setIsRendered(true);
  }, []);
  if (!isRendered) return null;

  return (
    <Dialog open={modalOpen} onOpenChange={() => setModalOpen((prev) => prev)}>
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
                <FormField control={form.control} name="imageUrl" render={({field})=>(
                  <FormItem>
                    <FormControl>
                      <FileUpload 
                        endpoint="serverImage"
                        value={field.value}
                        onChange={field.onChange}

                      />

                      </FormControl>
                  </FormItem>
                )} />
              
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
                        disabled={isLoading}
                        className="text-black bg-white border border-gray-200 focus-visible:rinc-0 focus-visible:ring-offset-0"
                        placeholder="Enter Server Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="py-4 bg-gray-200">
              <Button type="submit" disabled={isLoading} variant="primary">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitialModal;
