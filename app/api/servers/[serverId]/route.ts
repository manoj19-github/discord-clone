import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{serverId:string}}){
    try{
        const profile = await currentProfile();
        const {name,imageUrl} = await req.json();
        if(!profile) return new NextResponse("Unauthorized",{status:400});
        const server = await database.server.update({
            where:{
                id:params.serverId
            },
            data:{
                name,
                imageUrl
            }
        });
        return NextResponse.json(server,{status:200})



    }catch(error:any){
        console.log("error occured : ",error);
    }

}