'use client';

import React from 'react';
import { TrendingUp, Award, BarChart3 } from 'lucide-react';

interface QualityMetricsProps {
  psnr?: number; // Peak Signal-to-Noise Ratio
  ssim?: number; // Structural Similarity Index
  processingTime?: number; // in seconds
  improvementPercent?: number;
}

const QualityMetrics: React.FC<QualityMetricsProps> = ({
  psnr,
  ssim,
  processingTime,
  improvementPercent
}) => {
  const getQualityRating = (value: number, type: 'psnr' | 'ssim') => {
    if (type === 'psnr') {
      if (value >= 40) return { label: 'Excellent', color: 'text-primary' };
      if (value >= 30) return { label: 'Good', color: 'text-secondary' };
      if (value >= 20) return { label: 'Fair', color: 'text-yellow-500' };
      return { label: 'Poor', color: 'text-red-500' };
    } else {
      if (value >= 0.95) return { label: 'Excellent', color: 'text-primary' };
      if (value >= 0.85) return { label: 'Good', color: 'text-secondary' };
      if (value >= 0.70) return { label: 'Fair', color: 'text-yellow-500' };
      return { label: 'Poor', color: 'text-red-500' };
    }
  };

  return (
    <div className="glass-effect p-6 rounded-lg border-2 border-primary/30 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-glow">Quality Metrics</h3>
          <p className="text-xs text-wheat/60">Image enhancement analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PSNR */}
        {psnr !== undefined && (
          <div className="glass-effect p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-wheat/70 font-semibold">PSNR</span>
              <span className={`text-xs font-bold ${getQualityRating(psnr, 'psnr').color}`}>
                {getQualityRating(psnr, 'psnr').label}
              </span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">
              {psnr.toFixed(2)} dB
            </div>
            <p className="text-xs text-wheat/50">
              Signal-to-Noise Ratio
            </p>
            {/* Progress Bar */}
            <div className="mt-3 h-2 bg-dark-lighter rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${Math.min((psnr / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* SSIM */}
        {ssim !== undefined && (
          <div className="glass-effect p-4 rounded-lg border border-secondary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-wheat/70 font-semibold">SSIM</span>
              <span className={`text-xs font-bold ${getQualityRating(ssim, 'ssim').color}`}>
                {getQualityRating(ssim, 'ssim').label}
              </span>
            </div>
            <div className="text-3xl font-bold text-secondary mb-1">
              {ssim.toFixed(4)}
            </div>
            <p className="text-xs text-wheat/50">
              Structural Similarity
            </p>
            {/* Progress Bar */}
            <div className="mt-3 h-2 bg-dark-lighter rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-secondary to-primary transition-all duration-300"
                style={{ width: `${ssim * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-wheat/10">
        {processingTime !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-copper/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-copper" />
            </div>
            <div>
              <p className="text-xs text-wheat/60">Processing Time</p>
              <p className="text-sm font-bold text-copper">{processingTime.toFixed(2)}s</p>
            </div>
          </div>
        )}

        {improvementPercent !== undefined && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-wheat/60">Improvement</p>
              <p className="text-sm font-bold text-primary">+{improvementPercent.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Quality Guide */}
      <div className="pt-3 border-t border-wheat/10">
        <p className="text-xs text-wheat/50 mb-2">Quality Reference:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-wheat/60">PSNR:</span>
            <span className="text-primary ml-2">&gt;40dB = Excellent</span>
          </div>
          <div>
            <span className="text-wheat/60">SSIM:</span>
            <span className="text-secondary ml-2">&gt;0.95 = Excellent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityMetrics;


