import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;
export async function GET(req:Request){
    try{
        const profile  = await currentProfile();
        const {searchParams} = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get("channelId");
        if(!profile) return new NextResponse("unauthorized",{status:400})
        if(!channelId) return new NextResponse("channel id not found",{status:400})
        let messages:Message[] = [];
        if(cursor){
            messages = await database.message.findMany({
                take:MESSAGES_BATCH,
                skip:1,
                cursor:{
                    id:cursor
                },
                where:{
                    channelId:channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }else{
            messages = await database.message.findMany({
                take:MESSAGES_BATCH,
                skip:1,
                where:{
                    channelId:channelId
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            });

        }
        let nextCursor=null;
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH-1].id;
        }
        
        return NextResponse.json({
            items:messages,
            nextCursor
        },{status:200});

    }catch(error:any){
        console.log("error occured : ",error);
        return new NextResponse(`Internal Error , `,{status:500});
    }

}