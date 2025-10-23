'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import ProgressBar from './ProgressBar';

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  currentImage?: string;
  onClearImage?: () => void;
  uploadProgress?: number;
  isUploading?: boolean;
}

const ImageUploadWithProgress: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  onClearImage,
  uploadProgress = 0,
  isUploading = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        onImageSelect(file, previewUrl);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onImageSelect(file, previewUrl);
    }
  };

  return (
    <div className="glass-effect p-6 rounded-lg border border-primary/30 hindu-pattern">
      {currentImage ? (
        <div className="space-y-4">
          <div className="relative">
            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary/50">
              <Image
                src={currentImage}
                alt="Uploaded artifact"
                fill
                className="object-contain"
              />
              {/* Upload Complete Badge */}
              {!isUploading && (
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-primary/90 px-3 py-1 rounded-full text-sm font-bold">
                  <CheckCircle className="w-4 h-4" />
                  Uploaded
                </div>
              )}
            </div>
            {onClearImage && !isUploading && (
              <button
                onClick={onClearImage}
                className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 rounded-full transition-colors shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="glass-effect p-4 rounded-lg border border-primary/30">
              <ProgressBar
                progress={uploadProgress}
                status="Uploading your artifact..."
                color="primary"
              />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/10 saffron-glow'
              : 'border-primary/30 hover:border-primary'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50">
              <Upload className="w-8 h-8 text-primary animate-float" />
            </div>
            <div>
              <p className="text-lg font-semibold mb-1 text-glow">
                Drop your artifact image here
              </p>
              <p className="text-sm text-wheat/60">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-3 bg-primary hover:bg-primary-dark border border-primary rounded-lg transition-all duration-300 border-glow cursor-pointer font-semibold"
            >
              Choose File
            </label>
            <p className="text-xs text-wheat/50">
              Supports: JPG, PNG, WEBP • Max 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithProgress;


