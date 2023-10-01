import { database } from "@/lib/db.config"

const getAllServerByProfileId = async(profileId:string)=>{
    try{
        return await database.server.findMany({
            where:{
                members:{
                    some:{
                        profileId
                    }
                }
            }
        })

    }catch(error:any){
        console.log("error : ",error);
    }
    
}
export default getAllServerByProfileId;

