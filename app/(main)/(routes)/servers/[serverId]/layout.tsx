import getServerByIdWithProfile from "@/serverActions/getServerByIdWithProfile.action";
import ServerSidebar from "@/components/server/ServerSidebar";
import { currentProfile } from "@/lib/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC, ReactNode } from "react";

interface ServerIdLayoutProps {
  children: ReactNode;
  params: { serverId: string };
}
const ServerIdLayout: FC<ServerIdLayoutProps> = async ({
  children,
  params,
}) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  const server = await getServerByIdWithProfile(params.serverId, profile.id);
  if (!server) return redirect("/");

  return (
    <div className="w-full h-full">
      <div className="fixed inset-y-0 z-20 flex-col w-56 h-full hiddenToggleClass ">
        <ServerSidebar serverId={params.serverId}/>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
