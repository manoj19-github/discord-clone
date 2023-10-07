import { useSocket } from "@/components/providers/SocketProvider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Open_Sans } from 'next/font/google';

type ChatSocketProps={
    addKey:string;
    updateKey:string;
    queryKey:string;
}
type MessageWithMemberWithProfile = Message &{
    member:Member &{
        profile:Profile
    }
}

const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}:ChatSocketProps)=>{
    const {socket} = useSocket();
    const queryClient = useQueryClient();
    useEffect(()=>{
        if(!socket) return;

        //  manipulation of update message //
        socket.on(updateKey,(message:MessageWithMemberWithProfile)=>{
            console.log("update hit",message);
            queryClient.setQueryData([queryKey],(oldData:any)=>{
               if(!oldData || !oldData.pages || oldData.pages.length === 0)  return oldData;
               const newData = oldData.pages.map((self:any)=>{
                return{
                    ...self,
                    items:self.items.map((item:MessageWithMemberWithProfile)=>{
                        if(item.id === message.id){
                            return message;
                        }
                        return item
                    })

                }
               });
               return{
                ...oldData,
                pages:newData
               }
            })
        });

        //  manipulation of add message //
        socket.on(addKey,(message:MessageWithMemberWithProfile)=>{
            console.log("add key : ",message);
            queryClient.setQueryData([queryKey],(oldData:any)=>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return{
                        pages:[{
                            items:[message]
                        }]
                    }
                }
                const newData = [...oldData.pages];
                newData[0]={
                    ...newData[0],
                    items:[
                        message,
                        ...newData[0].items
                    ]

                };
                return{
                    ...oldData,
                    pages:newData
                }
            })
        });
        return()=>{
            socket.off(addKey);
            socket.off(updateKey);
        }



    },[queryClient,addKey,updateKey,socket])
    

}

export default useChatSocket;