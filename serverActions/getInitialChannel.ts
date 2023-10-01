import { database } from "@/lib/db.config"

const getInitialChannel = async(profileId:string,serverId:string)=>{
    try{
        return await database.server.findUnique({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId
                    }
                }
            },
            include:{
                channels:{
                    where:{
                        name:"general"
                    },
                    orderBy:{
                        createdAt:"asc"
                    }
                }
            }
        });

    }catch(error:any){
        console.log("error  : ",error);
        return null
    }
    

}
export default getInitialChannel;

