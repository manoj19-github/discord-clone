import { database } from "@/lib/db.config";

const getServerByIdWithChannelAndMembers = async(serverId:string)=>{
    try{
        return await database.server.findUnique({
            where:{
                id:serverId
            },
            include:{
                channels:{
                    orderBy:{
                        createdAt:"asc"
                    },
                },
                members:{
                    include:{
                        profile:true
                    },
                    orderBy:{
                        role:"asc"
                    }
                }
            },
        });
        

    }catch(error:any){
        console.log("error occured: ",error);
        return null
    }
    
}

export default getServerByIdWithChannelAndMembers