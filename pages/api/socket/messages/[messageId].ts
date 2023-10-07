import { currentProfileForPages } from "@/lib/currentProfileForPages";
import { database } from "@/lib/db.config";
import { NextApiResponseServerIO } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default async function handler(req:NextApiRequest,res:NextApiResponseServerIO){
    if(req.method !=="DELETE" &&  req.method !== "PATCH")
            return res.status(400).json({message:"Method not allowed"})
    try{
        const profile = await currentProfileForPages(req);
        const {messageId,serverId,channelId} = req.query;
        const {content} = req.body;
        if(!profile) return res.status(400).json({message:"Unauthorized"})
        if(!serverId) return res.status(400).json({message:"Server Id not found"})
        if(!messageId) return res.status(400).json({message:"message Id not found"})
        if(!channelId) return res.status(400).json({message:"channel Id not found"});

        const server = await database.server.findFirst({
            where:{
                id:serverId as string,
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            include:{
                members:true
            }
        });

        if(!server) return res.status(400).json({message:"Server  not found"});

        const channel = await database.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string
            }
        });

        if(!channel) return res.status(400).json({message:"Channel  not found"});

        const member = server.members.find((self,index)=>self.profileId === profile.id);
        if(!member) return res.status(400).json({message:"member  not found"});
        let message = await database.message.findFirst({
            where:{
                id:messageId as string,
                channelId:channelId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        if(!message || message.deleted ) return res.status(400).json({message:"message not found"})
        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
        if(!canModify) return res.status(400).json({message:"Unauthorized"})
        if(req.method === "DELETE"){
            message = await database.message.update({
                where:{
                    id:messageId as string,

                },
                data:{
                    fileUrl:null,
                    content:"This message has been deleted",
                    deleted:true
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            });
        }

        if(req.method === "PATCH"){
            if(!isMessageOwner) return res.status(400).json({message:"Unauthorized"})
            message = await database.message.update({
                where:{
                    id:messageId as string,

                },
                data:{
                    content,

                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            });
        }

        const updateKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey,message);
        return res.status(200).json(message);

    }catch(error){
        console.log(`error mesage:`,error);
        return res.status(500).json({message:"System error"})
    }
}