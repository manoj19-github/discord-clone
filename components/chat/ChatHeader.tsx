import { Hash, Menu } from "lucide-react";
import { FC } from "react";
import MobileToggle from "./MobileToggle";
import UserAvatar from "../ui/UserAvatar";
import SocketIndicator from "../ui/SocketIndicator";
interface ChatHeaderProps{
    serverId:string;
    name:string;
    type:"channel" | "conversation",
    imageUrl?:string;
}
const ChatHeader:FC<ChatHeaderProps> = ({serverId,name,type,imageUrl}):JSX.Element=>{
    return(
        <div className="flex items-center h-12 px-3 py-2 font-semibold border-b-2 text-md border-neutral-200 dark:border-neutral-800">
            <MobileToggle serverId={serverId}/>
            {type === "channel" ? (
                <>
                    <Hash className="w-5 h-5 mr-2 dark:text-zinc-400 text-zinc-500"/>
                </>
            ):(
               <></> 
            )}
            {
                type === "conversation" && !!imageUrl ? (
                    <UserAvatar src={imageUrl} className="w-5 h-5 mr-2" />

                ):(
                    <></>
                )
            }
            <p className="font-semibold text-black text-md dark:text-white ">
                {name}
            </p>
            <div className="flex items-center ml-auto">
                <SocketIndicator/>
            </div>
        </div>
    )

}
export default ChatHeader;