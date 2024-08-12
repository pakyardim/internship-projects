"use client";

import React, { useRef } from "react";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";

import userIcon from "src/assets/user-icon.png";

interface Props {
  onChange: (base64String: string) => void;
  value: string;
}

export function ImagePicker({ onChange, value }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-20 h-20 flex flex-col items-center">
      <div className="relative group w-full h-full">
        <Image
          fill
          src={value || userIcon}
          alt="Profile"
          className="rounded-full object-cover"
        />
        <div
          onClick={handleImageClick}
          className="rounded-full w-full h-full cursor-pointer absolute inset-0 flex items-center justify-center bg-grayish bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaUpload className="text-white text-2xl" />
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
}
