"use client";
import React, { FC, Fragment } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { FileIcon, X } from "lucide-react";
import toast from "react-hot-toast"
interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
  isLoading: boolean;
}
const FileUpload: FC<FileUploadProps> = ({
  onChange,
  value,
  endpoint,
  isLoading,
}): JSX.Element => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image src={value} fill alt="upload" className="rounded-full" />
        {!isLoading ? (
          <button
            className="absolute top-0 right-0 p-1 text-white rounded-full shadow-sm bg-rose-500"
            type="button"
            onClick={() => onChange("")}
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <Fragment></Fragment>
        )}
      </div>
    );
  }
  if(!!value && fileType === "pdf"){
    return(
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
      <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400"/>
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="ml-2 text-sm text-indogo-500 dark:indigo-400 hover:underline"
      >
        {value}
        </a>
      {!isLoading ? (
        <button
          className="absolute p-1 text-white rounded-full shadow-sm -top-2 -right-2 bg-rose-500"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </button>
      ) : (
        <Fragment></Fragment>
      )}
    </div>

    )
  }
  return (
    <UploadDropzone
      endpoint={endpoint}

      
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) =>toast.error("please provide valid document")}
    />
  );
};

export default FileUpload;
