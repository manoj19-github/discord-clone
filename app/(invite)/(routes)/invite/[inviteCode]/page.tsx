import { currentProfile } from '@/lib/currentProfile';
import createMemberByInviteCode from '@/serverActions/createMemberByInviteCode';
import getExistingServerByInviteCodeAndProfileId from '@/serverActions/getExistingServerByInviteCodeAndProfileId';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { FC } from 'react'

interface InviteCodePageProps{
  params:{
    inviteCode:string;
  }
}
const InviteCodePage:FC<InviteCodePageProps> = async({params}) => {
  const profile  = await currentProfile();
  if(!profile) return redirect(`${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}`);
  if(!params.inviteCode) return redirect("/");

  const existingServer = await getExistingServerByInviteCodeAndProfileId(params.inviteCode,profile.id)
  if(!!existingServer) return redirect(`/servers/${existingServer.id}`)
  const server = await createMemberByInviteCode(params.inviteCode,profile.id);
  if(!!server) return redirect(`/servers/${server.id}`)





  return (
    <div>InviteCodePage</div>
  )
}

export default InviteCodePage