"use client";
import  { FC, Fragment, useEffect, useState } from "react";

import CreateServerModal from "@/modals/createServerModal";
import InviteModal from "@/modals/InviteModal";
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
      <InviteModal/>
    </Fragment>
  );
};

export default ModalProvider;
