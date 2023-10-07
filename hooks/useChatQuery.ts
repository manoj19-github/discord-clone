import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";
import queryString from "query-string";

interface ChatQueryProps{
    queryKey:string;
    apiUrl:string;
    paramValue:string;
    paramKey:"channelId"|"conversationId"
}

export const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}:ChatQueryProps)=>{
    const {isConnected} = useSocket();
    console.log('isConnected: ', isConnected);
    const fetchMessages = async({pageParam = undefined })=>{
        try{
            const url = queryString.stringifyUrl({
                url:apiUrl,
                query:{
                    cursor:pageParam,
                    [paramKey]:paramValue
                }
            },{skipNull:true});
            const response = await fetch(url);
            return await response.json();

        }catch(error){
            console.log("error : ",error);
            return null;
        }
        
    }
    const {data,fetchNextPage,hasNextPage,isFetchingNextPage,status} = useInfiniteQuery({
        queryKey:[queryKey],
        queryFn:fetchMessages,
        getNextPageParam:(lastPage)=>lastPage?.nextCursor,
        refetchInterval:isConnected?false:1000
    });
    return{
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status

    }

}