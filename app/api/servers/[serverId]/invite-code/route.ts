import { currentProfile } from '@/lib/currentProfile';
import { database } from '@/lib/db.config';
import { NextResponse } from 'next/server';
import {v4 as uuidv4} from "uuid"


export async function PATCH(request:Request,{params}:{params:{serverId:string}}){

    try{

        const profile = await currentProfile();
        if(!profile) return new NextResponse("unauthorized",{status:401})
        if(!params.serverId) return new NextResponse("server id missing",{status:400})
        const server = await database.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id
            },
            data:{
                inviteCode:uuidv4()
            }
        })
        return NextResponse.json(server,{status:200});





    }catch(error:any){
        console.log("error:",error);
        return new NextResponse("Internal Server Error : ",{status:500})
    }

}