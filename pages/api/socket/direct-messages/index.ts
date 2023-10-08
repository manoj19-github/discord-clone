import { currentProfileForPages } from "@/lib/currentProfileForPages";
import { database } from "@/lib/db.config";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponseServerIO){
    if(req.method !== "POST"){
        return res.status(400).json({error:"Method not allowed"})
    }
    try{
        const profile = await currentProfileForPages(req);
        const {content,fileUrl} = req.body;
        const {conversationId,   currentMember} = req.query;
        
        if(!profile) return res.status(400).json({messages:"unauthenticated action"});
        if(!currentMember) return res.status(400).json({messages:"currentMember id not found"});
        if(!profile) return res.status(400).json({messages:"unauthenticated action"});
        if(!conversationId)return res.status(400).json({messages:"conversationId Id missing"});
        if(!content)return res.status(400).json({messages:"content missing"});
        console.log("conversationId :  ",conversationId )
        const conversation =await database.conversation.findFirst({
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
        })

        console.log("conversation : ",conversation)
       
        if(!conversation) return res.status(400).json({message:"conversation not found"});
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo
        if(!member) return res.status(400).json({message:"member is not found"});
        const message = await database.directMessage.create({
            data:{
                content,
                fileUrl,
                conversationId:conversationId as string,
                memberId:member.id as string,

            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        const channelKey = `chat:${conversationId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message)
        return res.status(200).json(message);




    }catch(error){
        console.log("messages post error : ",error);
        return res.status(500).json({error:error})
    }
}