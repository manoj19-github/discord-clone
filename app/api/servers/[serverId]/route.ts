import { currentProfile } from "@/lib/currentProfile";
import { database } from "@/lib/db.config";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{serverId:string}}){
    try{
        const profile = await currentProfile();
        const {name,imageUrl} = await req.json();
        if(!profile) return new NextResponse("Unauthorized",{status:401});
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
        return new NextResponse("Internal error : ",{status:500})
    }

}


export async function DELETE(req:Request,{params}:{params:{serverId:string}}){
    try{
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unauthorized",{status:401});
        const server = await database.server.delete({
            where:{
                id:params.serverId
            },
        });
        return NextResponse.json(server,{status:200})



    }catch(error:any){
        console.log("error occured : ",error);
        return new NextResponse("Internal error : ",{status:500})
    }

}