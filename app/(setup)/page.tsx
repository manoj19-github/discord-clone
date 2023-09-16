import { initialProfile } from "@/app/serverActions/initial.profile";
import getServerByProfile from "@/app/serverActions/getServerByProfile.action";
import {redirect} from "next/navigation"
import InitialModal from "@/modals/InitialModal";
const SetupPage = async()=>{
    let server;
    const profile = await initialProfile();
    if(!!profile)
    server = await getServerByProfile(profile.id)
    if(!!server) return redirect(`/servers/${server.id}`)
    return <InitialModal/>

}
export default SetupPage;
