import { initialProfile } from "@/app/serverActions/initial.profile";
import getServerByProfile from "@/app/serverActions/getServerByProfile.action";
import {redirect} from "next/navigation"
const SetupPage = async()=>{
    const profile = await initialProfile();
    const server = await getServerByProfile(profile.id)
    if(!!server) return redirect(`/servers/${server.id}`)
    

    return <div>Create A Server</div>

}
export default SetupPage;
