import { database } from "@/lib/db.config";

const getMemberByServerAndProfile =async (serverId:string,profileId:string)=>{
    try{
        return await database.member.findFirst({
            where:{
                serverId,
                profileId
            }
        })

    }catch(error:any){
        console.log("error : ",error);
    }

}
export default getMemberByServerAndProfile