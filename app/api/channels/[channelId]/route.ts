import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{channelId:string}}){
    try{
        const profile = await currentProfile();
        if(!profile) return new NextResponse(`unauthorized`,{status:401});
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!serverId) return new NextResponse("Server Id missing",{status:400})
        if(!params.channelId) return new NextResponse("Channel Id missing",{status:400})
        const server = await database.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                        }
                    }
                }
                
            },
            data:{
                channels:{
                    delete:{
                        id:params.channelId,
                        name:{
                            not:'general'

                        }
                    }
                }
            }
        });
        return NextResponse.json(server,{status:200})






    }catch(error:any){
        console.log(`error occured : `,error);
        return new NextResponse("Internal Error :",{status:500})
    }
}


export async function PATCH(req:Request,{params}:{params:{channelId:string}}){
    try{
        const profile = await currentProfile();
        if(!profile) return new NextResponse(`unauthorized`,{status:401});
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!serverId) return new NextResponse("Server Id missing",{status:400})
        if(!params.channelId) return new NextResponse("Channel Id missing",{status:400})
        const {name,type} = await req.json();
        if(name === "general") return new NextResponse('Name can not be genereal',{status:400})

        const server = await database.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                        }
                    }
                }
                
            },
            data:{
                channels:{
                    update:{
                        where:{
                            id:params.channelId,
                            NOT:{
                                name:'general'
                            }
                        },
                        data:{
                            name,
                            type
                        }
                    }
                }
            }
        });
        return NextResponse.json(server,{status:200})






    }catch(error:any){
        console.log(`error occured : `,error);
        return new NextResponse("Internal Error :",{status:500})
    }
}