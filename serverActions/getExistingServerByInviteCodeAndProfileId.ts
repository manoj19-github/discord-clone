import { database } from "@/lib/db.config";

const getExistingServerByInviteCodeAndProfileId = async(inviteCode:string,profileId:string)=>{
    try{
        return await database.server.findFirst({
            where:{
                inviteCode,
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

export default getExistingServerByInviteCodeAndProfileId