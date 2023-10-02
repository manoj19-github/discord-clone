"use client";
import React, { FC, useState,KeyboardEvent } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormStateReturn,
  useForm,
} from "react-hook-form";
import * as Zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";
import queryString from "query-string";
import axios from "axios";
interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = Zod.object({
  content: Zod.string().min(1),
});
const ChatInput: FC<ChatInputProps> = ({
  apiUrl,
  query,
  name,
  type,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<Zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async (values: Zod.infer<typeof formSchema>) => {
    console.log("onsubmit : ", values);
    
    try{
        setIsLoading(true)
        const url = queryString.stringifyUrl({
            url:apiUrl,
            query
        });
        await axios.post(url,values)




    }catch(error){
        console.log(`error : ${error}`);
    }finally{
        setIsLoading(false)
    }
  };
//   const handleOnKeyPress = (event:KeyboardEvent<HTMLInputElement>)=>{
//     console.log(`event key : `,event.key);

//   }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center "
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    placeholder={`Message ${type==="conversation" ? name:"# "+name}`}
                    disabled={isLoading}
                    className="py-6 border-0 border-none px-14 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                    {...field}
        
                  />
                  <div className="absolute top-7 right-8">
                    <Smile/>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
