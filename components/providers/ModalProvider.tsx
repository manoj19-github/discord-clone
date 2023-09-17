"use client";
import  { FC, Fragment, useEffect, useState } from "react";

import CreateServerModal from "@/modals/createServerModal";
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
    </Fragment>
  );
};

export default ModalProvider;
