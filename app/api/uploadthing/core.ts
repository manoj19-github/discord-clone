import {auth} from "@clerk/nextjs"
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const uploadingHandler = createUploadthing();
const handleAuth = ()=>{
    const {userId} = auth();
    if(!userId) throw new Error(`Unauthorized`);
    return {userId};
}
 

 

export const ourFileRouter = {
    serverImage:uploadingHandler({image:{maxFileSize:'4MB',maxFileCount:1}}).middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
    messageFile:uploadingHandler(["image","pdf"]).middleware(()=>handleAuth()).onUploadComplete(()=>{})


} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;