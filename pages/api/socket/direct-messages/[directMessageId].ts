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
        const {directMessageId,conversationId,currentMember} = req.query;
        const {content} = req.body;
        if(!currentMember) return res.status(400).json({message:"conversation Id not found"});
        if(!profile) return res.status(400).json({message:"Unauthorized"})
        if(!directMessageId) return res.status(400).json({message:"directMessage Id not found"})
        if(!conversationId) return res.status(400).json({message:"conversation Id not found"})
        
        
        const conversation = await database.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[
                    {
                        memberOneId:currentMember as string
                    },
                    {
                        memberTwoId:currentMember as string
                    }
                ]
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                },
            }
        });

        if(!conversation) return res.status(400)
        .json({message:"conversation Id not found"});
        

     
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne :conversation.memberTwo
        if(!member) return res.status(400).json({message:"member  not found"});
        let directMessage = await database.directMessage.findFirst({
            where:{
                id:directMessageId as string,
                conversationId:conversationId as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        if(!directMessage || directMessage.deleted ) return res.status(400).json({message:"message not found"})
        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
        if(!canModify) return res.status(400).json({message:"Unauthorized"})
        if(req.method === "DELETE"){
            directMessage = await database.directMessage.update({
                where:{
                    id:directMessageId as string,

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
            directMessage = await database.directMessage.update({
                where:{
                    id:directMessageId as string,

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

        const updateKey = `chat:${conversation.id}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey,directMessage);
        return res.status(200).json(directMessage);

    }catch(error){
        console.log(`error mesage:`,error);
        return res.status(500).json({message:"System error"})
    }
}