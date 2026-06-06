"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, ImageIcon, Upload, X } from "lucide-react";
import { RingLoader } from "react-spinners";
import Image from "next/image";

import { Button } from "./ui/button";

export default function ImageUploader({ onImageSelect, loading }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      onImageSelect(file);
    },
    [onImageSelect],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10485760,
    noClick: true,
    noKeyboard: true,
  });

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onDrop([file]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (preview) {
    return (
      <div className="relative w-full aspect-video bg-stone-100 border-2 border-stone-200 rounded-2xl overflow-hidden">
        <Image
          src={preview}
          alt="Pantry Preview"
          fill
          className="object-cover"
        />

        {!loading && (
          <Button className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all p-2">
            <X className="w-5 h-5 text-stone-700" />
          </Button>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/40 flex justify-center items-center">
            <RingLoader color="white" />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`relative w-full aspect-square border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          isDragActive
            ? "bg-orange-50 border-orange-600 scale-[1.02]"
            : "bg-stone-50 border-stone-300 hover:bg-orange-50/50 hover:border-orange-400"
        }`}
      >
        <input {...getInputProps()} />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center gap-4 p-8">
          <div
            className={`rounded-full transition-all p-4 ${
              isDragActive ? "bg-orange-600 scale-110" : "bg-orange-100"
            }`}
          >
            {isDragActive ? (
              <ImageIcon className="w-8 h-8 text-white" />
            ) : (
              <Camera className="w-8 h-8 text-orange-600" />
            )}
          </div>

          <div>
            <h3 className="text-xl text-stone-900 font-bold mb-2">
              {isDragActive ? "Drop Your Image Here" : "Scan Your Pantry"}
            </h3>

            <p className="text-stone-600 text-sm max-w-sm">
              {isDragActive
                ? "Release to Upload"
                : "Take a Photo or Drag & Drop an Image of your Fridge/Pantry"}
            </p>
          </div>

          {!isDragActive && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </Button>

              <Button
                type="button"
                variant="outline"
                className="text-orange-700 border-orange-200 hover:bg-orange-50 gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                <Upload className="w-4 h-4" />
                Browse Files
              </Button>
            </div>
          )}

          <p className="text-stone-400 text-xs">
            Supports JPG, PNG, WebP • Max 10MB
          </p>
        </div>
      </div>

      {/* Hidden File Input With Capture Attribute For Mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </>
  );
}
