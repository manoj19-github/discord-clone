import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { NextResponse } from "next/server";

interface IParams{
    params:{
        serverId:string;
    }
}
export async function PATCH(req:Request,{params}:IParams){
    try{
        const profile = await currentProfile();
        if(!profile) return new NextResponse(`Unauthorized`,{status:400})
        if(!params.serverId) return new NextResponse('server id missing ',{status:400})
        const server = await database.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            data: {
                members:{
                    deleteMany:{
                        profileId:profile.id
                    }
                }
            }
        });

        return NextResponse.json(server,{status:200})



    }catch(error:any){
        console.log("error : ",error);
        return new NextResponse("internal server error :",{status:500})
    }
}