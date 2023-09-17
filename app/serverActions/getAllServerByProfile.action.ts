import { database } from "@/lib/db.config"

const getAllServerByProfileId = async(profileId:string)=>{
    return await database.server.findMany({
        where:{
            members:{
                some:{
                    profileId
                }
            }
        }
    })
}
export default getAllServerByProfileId;

