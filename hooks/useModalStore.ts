import { Server } from "@prisma/client";
import {create} from "zustand"
export type ModalType = "createServer" | "editServer" | "createChannel" | "invite";

interface ModalData{
    server?:Server
}

export interface ModalStore{
    type:ModalType | null;
    isOpen:boolean;
    data:ModalData;
    onOpen:(type:ModalType,data?:ModalData)=>void;
    onClose:()=>void;
}

export const useModalStore = create<ModalStore>((set)=>({
    type:null,
    isOpen:false,
    onOpen:(type,data={})=>set({isOpen:true,type,data}),
    onClose:()=>set({type:null,isOpen:false}),
    data:{}
}))