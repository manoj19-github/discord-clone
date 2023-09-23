"use client";
import  { FC, Fragment, useEffect, useState } from "react";

import CreateServerModal from "@/modals/CreateServerModal";
import InviteModal from "@/modals/InviteModal";
import EditServerModal from "@/modals/EditServerModal";
import MembersModal from "@/modals/MembersModal";
import CreateChannelModal from "@/modals/CreateChannelModal";
import LeaveModal from "@/modals/LeaveServerModel";
import DeleteServer from "@/modals/DeleteServerModal";
interface ModalProviderProps {}
const ModalProvider: FC<ModalProviderProps> = (): JSX.Element | null => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Fragment>
      <CreateServerModal />
      <EditServerModal/>
      <InviteModal/>
      <MembersModal/>
      <CreateChannelModal/>
      <LeaveModal/>
      <DeleteServer/>
    </Fragment>
  );
};

export default ModalProvider;
