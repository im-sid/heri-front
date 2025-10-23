'use client';

import React, { useState } from 'react';
import { Sliders, Info } from 'lucide-react';

interface IntensitySliderProps {
  onIntensityChange: (intensity: number) => void;
  initialIntensity?: number;
  min?: number;
  max?: number;
  label?: string;
  description?: string;
}

const IntensitySlider: React.FC<IntensitySliderProps> = ({
  onIntensityChange,
  initialIntensity = 75,
  min = 0,
  max = 100,
  label = "Enhancement Intensity",
  description = "Adjust the strength of the enhancement effect"
}) => {
  const [intensity, setIntensity] = useState(initialIntensity);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setIntensity(value);
    onIntensityChange(value);
  };

  const getIntensityColor = (value: number) => {
    if (value <= 30) return 'from-secondary to-secondary-dark';
    if (value <= 60) return 'from-copper to-primary';
    return 'from-primary to-saffron';
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 25) return 'Subtle';
    if (value <= 50) return 'Moderate';
    if (value <= 75) return 'Strong';
    return 'Maximum';
  };

  return (
    <div className="glass-effect p-5 rounded-lg border border-primary/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <Sliders className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{label}</h4>
            <p className="text-xs text-wheat/60">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{intensity}%</div>
          <div className="text-xs text-wheat/60">{getIntensityLabel(intensity)}</div>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={intensity}
          onChange={handleChange}
          className="w-full h-3 bg-dark-lighter rounded-full appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, rgb(255 153 51) 0%, rgb(212 175 55) ${intensity}%, rgb(42 31 26) ${intensity}%, rgb(42 31 26) 100%)`
          }}
        />
        {/* Gradient Track Overlay */}
        <div className="absolute top-0 left-0 right-0 h-3 rounded-full pointer-events-none opacity-30"
             style={{
               background: `linear-gradient(to right, ${intensity <= 30 ? '#D4AF37' : intensity <= 60 ? '#B87333' : '#FF9933'} 0%, ${intensity <= 30 ? '#B8860B' : intensity <= 60 ? '#FF9933' : '#FFAA44'} 100%)`,
               width: `${intensity}%`
             }}
        />
      </div>

      {/* Intensity Markers */}
      <div className="flex justify-between text-xs text-wheat/50 px-1">
        <span>Subtle</span>
        <span>Moderate</span>
        <span>Strong</span>
        <span>Max</span>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-wheat/70">
          Higher intensity means stronger enhancement but may introduce artifacts. 
          <span className="text-primary font-semibold"> Recommended: 60-80%</span>
        </p>
      </div>

      {/* Quick Presets */}
      <div className="flex gap-2">
        <button
          onClick={() => { setIntensity(30); onIntensityChange(30); }}
          className="flex-1 px-3 py-1.5 text-xs bg-secondary/20 hover:bg-secondary/30 border border-secondary/30 rounded-lg transition-colors"
        >
          Light
        </button>
        <button
          onClick={() => { setIntensity(60); onIntensityChange(60); }}
          className="flex-1 px-3 py-1.5 text-xs bg-copper/20 hover:bg-copper/30 border border-copper/30 rounded-lg transition-colors"
        >
          Balanced
        </button>
        <button
          onClick={() => { setIntensity(85); onIntensityChange(85); }}
          className="flex-1 px-3 py-1.5 text-xs bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg transition-colors"
        >
          Intense
        </button>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF9933 0%, #D4AF37 100%);
          cursor: pointer;
          border: 3px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(255, 153, 51, 0.5);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF9933 0%, #D4AF37 100%);
          cursor: pointer;
          border: 3px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(255, 153, 51, 0.5);
        }
      `}</style>
    </div>
  );
};

export default IntensitySlider;


