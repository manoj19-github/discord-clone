"use client";
import * as Zod from "zod"
import axios from "axios";
import queryString from "query-string";
import {useForm} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import UserAvatar from "../ui/UserAvatar";
import ActionTooltip from './../ui/ActionTooltip';
import { Edit, EditIcon, FileIcon, Loader2, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useModalStore } from "@/hooks/useModalStore";
import { useRouter,useParams } from "next/navigation";
const ROLEICONMAP = {
    "GUEST":null,
    "MODERATOR":<ShieldCheck className="w-4 h-4 text-indigo-400"/>,
    "ADMIN":<ShieldAlert className="w-4 h-4 text-rose-400"/>
}

const formSchema = Zod.object({
    content:Zod.string().min(1)
})
interface ChatItemProps{
    id:string;
    content:string;
    member:Member & {
        profile:Profile
    },
    timestamp:string;
    fileUrl:string|null;
    deleted:boolean;
    currentMember:Member;
    isUpdate:boolean;
    socketUrl:string;
    socketQuery:Record<string,string>;



}

const ChatItem:FC<ChatItemProps> = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdate,
    socketQuery,
    socketUrl

}):JSX.Element=>{
    const router = useRouter();
    const params = useParams();

    const [isEditing,setEditing] = useState<boolean>(false);
    const [isLoading,setLoading] = useState<boolean>(false);
    const [isDeleting,setDeleting] = useState<boolean>(false);
    const fileType = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.role === member.role
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEdited = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;
    const {onOpen} = useModalStore();
    const form = useForm<Zod.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            content:content
        }
    });
    useEffect(()=>{
        form.reset({
            content:content
        });

    },[content])
    const onSubmitHandler = async(values:Zod.infer<typeof formSchema>)=>{
        try{
            setLoading(true);
            const url = queryString.stringifyUrl({
                url:`${socketUrl}/${id}`,
                query:socketQuery
            });
            await axios.patch(url,values);
            toast.success(`message updated`)



        }catch(error){
            console.log("error : ",error);
            toast.error(`something went wrong`)
        }finally{
            setLoading(false);
            setEditing(false);
        }

    }

    useEffect(()=>{
        const handleKeyDown = (event:any)=>{
            if(event.key ==="Escape" || event.keyCode === 27){
                setEditing(false);
            }
        }
        window.addEventListener("keydown",handleKeyDown);
        return()=> window.removeEventListener("keydown",handleKeyDown);
    },[])

    const onMemberClick=()=>{
        if(member.id === currentMember.id) return;
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)

    }

    return(
        <div className="relative flex items-center w-full p-4 transition-all group hover:bg-black/5">
            <div className="flex items-start w-full group gap-x-2">
                <div onClick={onMemberClick} className="transition-all cursor-pointer hover:drop-shadow-md">
                    <UserAvatar src={member.profile.imageUrl} className="w-3 h-3 mr-2" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <p onClick={onMemberClick}  className="text-sm font-semibold cursor-pointer hover:underline">
                            {member.profile.name}
                        </p>
                        <ActionTooltip label={member.role}>
                            {ROLEICONMAP[member.role]}
                            
                        </ActionTooltip>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {timestamp}

                    </span>
                  {
                    isImage ?(
                        <a href={fileUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex items-center w-48 h-48 mt-2 overflow-hidden border rounded-md aspect-sqare bg-secondary"
                        >
                            <Image src={fileUrl} alt={content} fill className="object-cover"/>
                        </a>

                    ):(<></>)
                  }
                  {
                    isPDF ? (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400"/>
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 hover:underline">
                                {fileUrl}
                            </a>

                        </div>


                    ):(<></>)
                  }
                  {
                    !fileUrl && !isEditing? (
                        <p className={cn("text-sm text-zinc-600 dark:text-zinc-300",deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1")}>
                            {content}
                            {isUpdate && !deleted ?(
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
                            ):(<></>)}
                        </p>
                    ):(<></>)
                  }
                  {!fileUrl && isEditing && (
                    <Form {...form}>
                        <form className="flex items-center w-full gap-2 pt-2" onSubmit={form.handleSubmit(onSubmitHandler)}>
                            <FormField control={form.control} name="content" render={({field})=>(
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <div className="relative w-full">
                                            {isLoading ?<div className="absolute top-0 left-0 w-full h-full bg-transparent"></div> :<></> }
                                            <Input 
                                                className="p-2 border-0 border-none bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                placeholder="Edited Message"
                                                {...field}
                                            />

                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                            />
                            <Button disabled={isLoading} size="sm" type="submit" variant="primary">
                                {!isLoading ? `Save`: <Loader2 className="w-6 h-6 my-4 text-white animate-spin" />}
                            </Button>
                        </form>
                        <span className="text-[10px] mt-1 text-zinc-400">
                            Press escape to cancel, enter to save
                        </span>
                    </Form>
                  )}
                </div>
            </div>
            {
                canDeleteMessage ? (
                    <div className="absolute items-center hidden p-1 bg-white border group-hover:flex gap-x-2 top-2 right-5 dark:bg-zinc-600 rouded-sm ">
                        {
                            canEdited ? (
                                <ActionTooltip label="Edit">
                                    <Edit onClick={()=>setEditing(true)} className="w-4 h-4 ml-auto transition-all cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 right-8"/>

                                </ActionTooltip>
                            ):(<></>)
                        }
                        <ActionTooltip label="Delete">
                                    <Trash 
                                        className="w-4 h-4 ml-auto transition-all cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400 "
                                        onClick={()=>onOpen("deleteMessage",{apiUrl:`${socketUrl}/${id}`,query:socketQuery})}
                                    />

                                </ActionTooltip>
                    </div>

                ):(<></>)
            }
        </div>
    )
}

export default ChatItem;