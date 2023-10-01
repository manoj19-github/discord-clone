import { database } from "@/lib/db.config";

const getChannelById = async(channelId:string)=>{
    try{
        return await database.channel.findUnique({
            where:{
                id:channelId  
            }
        })


    }catch(error:any){
        console.log("error : ",error);
    }

}

export default getChannelById;