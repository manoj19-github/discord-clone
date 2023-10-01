import { currentProfile } from "@/lib/currentProfile";
import getInitialChannel from "@/serverActions/getInitialChannel";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react"

interface ServerIdPageProps{
    params:{
        serverId:string;
    }
}
const ServerIdPage:FC<ServerIdPageProps> = async({params})=>{
    const profile = await currentProfile();
    if(!profile) return redirectToSignIn();
    if(!params?.serverId) return redirect(`/`)
    const initialChannel = await getInitialChannel(profile.id,params.serverId);
    const generalChannel = initialChannel?.channels[0]
    if(generalChannel?.name !== "general") return null;
    return redirect(`/servers/${params.serverId}/channels/${generalChannel?.id}`)
}

export default ServerIdPage