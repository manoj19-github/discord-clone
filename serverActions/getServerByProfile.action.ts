import { database } from "@/lib/db.config";

const getServerByProfile = async(profileId:string)=>{
    try{
        return await database.server.findFirst({
            where:{
                members:{
                    some:{
                        profileId
                    }
                }
            }
        })

    }catch(error:any){
        console.log("error occured : ",error);
        return null
    }
}

export default getServerByProfile