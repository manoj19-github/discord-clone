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
        const {serverId,channelId} = req.query;
        if(!profile) return res.status(400).json({messages:"unauthenticated action"});
        if(!serverId)return res.status(400).json({messages:"Server Id missing"});
        if(!channelId)return res.status(400).json({messages:"channel Id missing"});
        if(!content)return res.status(400).json({messages:"content missing"});
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
        })
        if(!server)return res.status(400).json({messages:"server is not found"});
        const  channel = await database.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string
            }
        })
        if(!channel) return res.status(400).json({message:"channel is not found"});
        const member = server.members.find((self)=>self.profileId === profile.id);
        if(!member) return res.status(400).json({message:"member is not found"});
        const message = await database.message.create({
            data:{
                content,
                fileUrl,
                channelId:channelId as string,
                memberId:member.id as string
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });
        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey,message)
        return res.status(200).json(message);




    }catch(error){
        console.log("messages post error : ",error);
        return res.status(500).json({error:error})
    }
}