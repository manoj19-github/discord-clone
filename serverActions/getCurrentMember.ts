import { database } from "@/lib/db.config";

const getCurrentMemeber = async(serverId:string,profileId:string)=>{
    try{
        return await database.member.findFirst({
            where:{
                serverId,
                profileId
            },
            include:{
                profile:true
            }
        });
    }catch(error:any){
        console.log("error occured");
        return null;
    }
}

export default getCurrentMemeber;