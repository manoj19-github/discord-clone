import { database } from "@/lib/db.config";

const getServerByIdWithProfile = async(serverId:string,profileId:string)=>{
    try{
        return await database.server.findUnique({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId
                    }
                }

            }
        })

    }catch(error:any){
        console.log("error occured : ",error);
    }
}

export default getServerByIdWithProfile