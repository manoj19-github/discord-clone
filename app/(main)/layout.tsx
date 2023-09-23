import NavigationSidebar from "@/components/navigation/NavigationSidebar";
import React, { FC, ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}
const MainLayout: FC<MainLayoutProps> = async ({ children }) => {
  return (
    <div className="h-full  ">
      <div className=" hiddenToggleClass h-full w-[72px] z-30 flex-col fixed inset-y-0  ">
        <NavigationSidebar/>
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
