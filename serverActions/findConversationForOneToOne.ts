import { database } from "@/lib/db.config"


const findConversation = async(memberOneId:string,memberTwoId:string)=>{
    try{
        return await database.conversation.findFirst({
            where:{
                AND:[
                    {
                        memberOneId:memberOneId
    
                    },
                    {
                        memberTwoId:memberTwoId
                    }
                ]
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
        console.log("error : ",error);
        return null
    }
    
}

export default findConversation