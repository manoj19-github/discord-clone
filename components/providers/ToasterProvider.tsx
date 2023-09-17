import React, { FC } from "react";
import { Toaster } from "react-hot-toast";

interface ToasterProviderProps{}
const ToasterProvider:FC<ToasterProviderProps> = ():JSX.Element => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="base-font-bold"
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "base-font-bold",
          duration: 5000,
          success: {
            duration: 3000,
            style: {
              background: "green",
              color: "#fff",
              zIndex: 999,
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "#ff0000",
              color: "#fff",
              zIndex: 999,
            },
          },
        }}
      />
    </>
  );
};

export default ToasterProvider;
