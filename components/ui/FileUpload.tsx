"use client";
import React, { FC } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

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
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => console.log("error : ", error)}
    />
  );
};

export default FileUpload;
