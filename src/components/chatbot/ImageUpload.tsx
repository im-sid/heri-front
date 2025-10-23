'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage: string | null;
  onClearImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage, onClearImage }) => {
  const [preview, setPreview] = useState<string | null>(currentImage);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageSelect(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
  });

  const handleClear = () => {
    setPreview(null);
    onClearImage();
  };

  if (preview || currentImage) {
    return (
      <div className="relative glass-effect p-4 rounded-lg border border-primary/30">
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 z-10 p-2 bg-dark/80 hover:bg-red-500/80 rounded-lg border border-primary/30 transition-colors duration-300"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image
            src={preview || currentImage || ''}
            alt="Uploaded artifact"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Click the X to upload a different image
        </p>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`glass-effect p-8 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-primary/30 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          {isDragActive ? (
            <ImageIcon className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <h3 className="font-sans text-lg font-semibold mb-2">
          {isDragActive ? 'Drop your image here' : 'Upload Artifact Image'}
        </h3>
        <p className="text-gray-400 text-sm">
          Drag & drop an image or click to browse
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Supports: PNG, JPG, JPEG, WEBP
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;



