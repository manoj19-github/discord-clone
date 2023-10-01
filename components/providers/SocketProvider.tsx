"use client"
import {FC, ReactNode, createContext,use,useContext,useEffect,useState} from 'react'
import {io as ClientIO} from "socket.io-client"

type SocketContextType={
    socket:any|null;
    isConnected:boolean;
}

const socketContext = createContext<SocketContextType>({
    socket:null,
    isConnected:false,

})

export const useSocket = ()=>{
    return useContext(socketContext)
}


interface SocketProviderProps{
    children:ReactNode;
}

const SocketProvider:FC<SocketProviderProps> = ({children}) => {
    const [socket,setSocket] = useState(null);
    const [isConnected,setIsConnected] = useState<boolean>(false);
    useEffect(()=>{
        const socketInstance = new(ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!,{
            path:"/api/socket/io",
            addTrailingSlash:false
        });
        socketInstance.on("connect",()=>{
            setIsConnected(true);
        })
        socketInstance.on("disconnect",()=>{
            setIsConnected(false);
        })

        setSocket(socketInstance);
        return()=>{
            socketInstance.disconnect();
        }


    },[])

  return (
    <socketContext.Provider value={{socket,isConnected}}>
        {children}
    </socketContext.Provider>
  )
}

export default SocketProvider