import createConversationForOneToOne from "./createConversationForOneToOne";
import findConversation from "./findConversationForOneToOne"

 const getOrCreateConversationForOneToOne=async(memberOneId:string,memberTwoId:string)=>{
    let conversation = await findConversation(memberOneId,memberTwoId) || await findConversation(memberTwoId,memberOneId);
    if(!conversation){
        conversation =  await createConversationForOneToOne(memberOneId,memberTwoId);
    }
    return conversation;

}
export default getOrCreateConversationForOneToOne