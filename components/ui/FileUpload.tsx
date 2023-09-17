"use client";
import React, { FC } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import Image from "next/image";
import { X } from "lucide-react";
interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}
const FileUpload: FC<FileUploadProps> = ({
  onChange,
  value,
  endpoint,
}): JSX.Element => {
  const fileType = value?.split(".").pop();
  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20">
        <Image src={value} fill alt="upload" className="rounded-full" />
        <button
          className="absolute top-0 right-0 p-1 text-white rounded-full shadow-sm bg-rose-500"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => console.log("error : ", error)}
    />
  );
};

export default FileUpload;
