'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, RotateCcw, Download, Trash2, Check } from 'lucide-react';

interface ROISelectorProps {
  imageUrl: string;
  onMaskComplete: (maskDataUrl: string) => void;
  onCancel: () => void;
}

const ROISelector: React.FC<ROISelectorProps> = ({
  imageUrl,
  onMaskComplete,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [mode, setMode] = useState<'paint' | 'erase'>('paint');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = mode === 'paint' ? 'source-over' : 'destination-out';
    ctx.fillStyle = 'rgba(255, 153, 51, 0.5)'; // Saffron with transparency
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw original image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  };

  const generateMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas for the mask (black and white)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    // Draw white background
    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Get the painted areas from original canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Create mask: painted areas = black, rest = white
    const maskData = maskCtx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < data.length; i += 4) {
      // Check if pixel has the overlay color (saffron)
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // If there's significant alpha from our overlay
      if (a > 100 && r > 200) {
        // Black (area to restore)
        maskData.data[i] = 0;
        maskData.data[i + 1] = 0;
        maskData.data[i + 2] = 0;
        maskData.data[i + 3] = 255;
      } else {
        // White (area to keep)
        maskData.data[i] = 255;
        maskData.data[i + 1] = 255;
        maskData.data[i + 2] = 255;
        maskData.data[i + 3] = 255;
      }
    }

    maskCtx.putImageData(maskData, 0, 0);
    const maskDataUrl = maskCanvas.toDataURL();
    onMaskComplete(maskDataUrl);
  };

  const downloadMask = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `mask-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="glass-effect p-6 rounded-lg border-2 border-primary/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-glow">ROI Selector</h3>
          <p className="text-sm text-wheat/60">Paint the areas you want to restore</p>
        </div>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm bg-dark/50 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Canvas */}
      <div className="relative border-2 border-primary/50 rounded-lg overflow-hidden bg-dark/50">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-auto cursor-crosshair"
          style={{ maxHeight: '500px', objectFit: 'contain' }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-wheat/60">Loading image...</p>
            </div>
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setMode('paint')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
            mode === 'paint'
              ? 'bg-primary/30 border-primary text-white'
              : 'bg-primary/5 border-primary/30 hover:border-primary'
          }`}
        >
          <Paintbrush className="w-5 h-5" />
          <span className="font-semibold">Paint</span>
        </button>

        <button
          onClick={() => setMode('erase')}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
            mode === 'erase'
              ? 'bg-secondary/30 border-secondary text-white'
              : 'bg-secondary/5 border-secondary/30 hover:border-secondary'
          }`}
        >
          <Eraser className="w-5 h-5" />
          <span className="font-semibold">Erase</span>
        </button>

        <button
          onClick={clearCanvas}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-copper/10 hover:bg-copper/20 border-2 border-copper/30 rounded-lg transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="font-semibold">Reset</span>
        </button>

        <button
          onClick={downloadMask}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-dark/50 hover:bg-dark border-2 border-wheat/20 rounded-lg transition-all"
        >
          <Download className="w-5 h-5" />
          <span className="font-semibold">Save</span>
        </button>
      </div>

      {/* Brush Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-wheat/80">Brush Size: {brushSize}px</label>
          <div className="flex gap-2">
            <button
              onClick={() => setBrushSize(10)}
              className="px-3 py-1 text-xs bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 rounded-lg"
            >
              Small
            </button>
            <button
              onClick={() => setBrushSize(25)}
              className="px-3 py-1 text-xs bg-copper/20 hover:bg-copper/30 border border-copper/30 rounded-lg"
            >
              Medium
            </button>
            <button
              onClick={() => setBrushSize(50)}
              className="px-3 py-1 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg"
            >
              Large
            </button>
          </div>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 bg-dark-lighter rounded-full appearance-none cursor-pointer"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-wheat/10">
        <button
          onClick={generateMask}
          disabled={!imageLoaded}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark border border-primary rounded-lg transition-all font-semibold disabled:opacity-50"
        >
          <Check className="w-5 h-5" />
          Apply & Restore
        </button>
        <button
          onClick={clearCanvas}
          className="px-6 py-3 bg-dark/50 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-xs text-wheat/70">
          <span className="font-bold text-primary">How to use:</span> Paint over the damaged or faded areas you want to restore. 
          The AI will intelligently fill these regions. Use Erase to fix mistakes. Click "Apply & Restore" when ready.
        </p>
      </div>
    </div>
  );
};

export default ROISelector;


