import { database } from "@/lib/db.config";

const createConversationForOneToOne = async(memberOneId:string,memberTwoId:string)=>{
    try{
        return await database.conversation.create({
            data:{
                memberOneId,
                memberTwoId
            },
            include:{
                memberOne:{
                    include:{
                        profile:true
                    }
                },
                memberTwo:{
                    include:{
                        profile:true
                    }
                }
            }
        })

    }catch(error:any){
        console.log("error occured",error);
        return null;
    }

}

export default createConversationForOneToOne