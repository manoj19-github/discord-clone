import { auth } from "@clerk/nextjs";
import { database } from "@/lib/db.config";
export const currentProfile = async()=>{
    const {userId} = auth();
    if(!userId) return null;
    const profile = await database.profile.findUnique({
        where:{
            userId
        }
    });
    return profile
}
