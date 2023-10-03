import { initialProfile } from "@/serverActions/initial.profile";
import getServerByProfile from "@/serverActions/getServerByProfile.action";
import {redirect} from "next/navigation"
import InitialModal from "@/modals/InitialModal";
const SetupPage = async()=>{
    let server;
    const profile = await initialProfile();
    
    if(!!profile)
    server = await getServerByProfile(profile.id)
console.log("server : ",server);
    
    if(!!server) return redirect(`/servers/${server.id}`)
    if(server ===null) return <InitialModal/>
    return <></>
    

}
export default SetupPage;
