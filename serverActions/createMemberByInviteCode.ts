import { database } from "@/lib/db.config";

const createMemberByInviteCode = async(inviteCode:string,profileId:string)=>{
    try{

            return await database.server.update({
                where:{
                    inviteCode
                },
                data:{
                    members:{
                        create:[
                            {
                                profileId
                            }
                        ]
                    }
                }
            });
    }catch(error){
        console.log("error : ",error);
    }
}

export default createMemberByInviteCode