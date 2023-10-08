import { RefObject, useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: RefObject<HTMLDivElement>;
  bottomRef: RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};
const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {

  const [hasInitialize, setHasInitialize] = useState<boolean>(false);
  const [distanceFromFooter, setDistanceFromFooter] = useState<number>(0);

  useEffect(() => {
    const topDiv = chatRef?.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;
      if(!!topDiv){
        const distanceFromBottom = topDiv?.scrollHeight - topDiv?.scrollTop - topDiv?.clientHeight;
        setDistanceFromFooter(distanceFromBottom)

      }
      
   
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };
    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitialize && bottomDiv) {
        setHasInitialize(true);
        return true;
      }
      if (!topDiv) return false;
      const distanceFromBottom =
      
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
        setDistanceFromFooter(distanceFromBottom)

   
      return distanceFromBottom <= 100;
    };
    if(shouldAutoScroll()){
  
        setTimeout(()=>{
            bottomRef?.current?.scrollIntoView({
                behavior:"smooth"
            })
        },100)
    }

  }, [bottomRef,chatRef,count,hasInitialize]);
  return{
    distanceFromFooter
  }

};

export default useChatScroll;
