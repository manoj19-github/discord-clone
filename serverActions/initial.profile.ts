import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { database } from "@/lib/db.config";

export const initialProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return redirectToSignIn();
    }
    const profile = await database.profile.findUnique({
      where: {
        userId: user.id
      },
    });
    if(!!profile) return profile
    return await database.profile.create({
        data:{
            userId:user.id,
            name:`${user.firstName} ${user.lastName}`,
            imageUrl:user.imageUrl,
            email:user.emailAddresses[0].emailAddress
        }
    })

  } catch (error: any) {
    console.log("error in initial profile  :  ", error);
  }
};
