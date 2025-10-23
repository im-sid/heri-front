'use client';

import React from 'react';
import Image from 'next/image';
import { Download, Zap, Activity, Eye, Layers, Map } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisOutputsProps {
  analysis: {
    edges?: string;
    heat_map?: string;
    details?: string;
    grayscale?: string;
    texture?: string;
  };
}

const AnalysisOutputs: React.FC<AnalysisOutputsProps> = ({ analysis }) => {
  if (!analysis || Object.keys(analysis).length === 0) {
    return null;
  }

  const outputs = [
    {
      key: 'edges',
      title: 'Edge Detection',
      description: 'Detected edges and boundaries',
      icon: <Activity className="w-5 h-5" />,
      color: 'border-saffron',
      bgColor: 'bg-saffron/10'
    },
    {
      key: 'heat_map',
      title: 'Heat Map',
      description: 'Intensity distribution visualization',
      icon: <Map className="w-5 h-5" />,
      color: 'border-gold',
      bgColor: 'bg-gold/10'
    },
    {
      key: 'details',
      title: 'Detail Enhancement',
      description: 'Enhanced texture and details',
      icon: <Zap className="w-5 h-5" />,
      color: 'border-copper',
      bgColor: 'bg-copper/10'
    },
    {
      key: 'grayscale',
      title: 'Luminance Analysis',
      description: 'Grayscale contrast analysis',
      icon: <Eye className="w-5 h-5" />,
      color: 'border-wheat',
      bgColor: 'bg-wheat/10'
    },
    {
      key: 'texture',
      title: 'Texture Map',
      description: 'Surface texture extraction',
      icon: <Layers className="w-5 h-5" />,
      color: 'border-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `heri-science-${filename}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-8">
      <h2 className="font-serif text-2xl font-bold mb-4 text-glow flex items-center gap-2">
        <Activity className="w-6 h-6 text-primary" />
        Image Processing Analysis
      </h2>
      <p className="text-wheat/70 mb-6">
        Advanced visualizations showing different aspects of the processed image
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {outputs.map((output, index) => {
          const imageUrl = analysis[output.key as keyof typeof analysis];
          if (!imageUrl) return null;

          return (
            <motion.div
              key={output.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-effect p-4 rounded-lg border-2 ${output.color} ${output.bgColor} hover:scale-105 transition-transform duration-300`}
            >
              {/* Title */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full ${output.bgColor} flex items-center justify-center text-${output.color.replace('border-', '')}`}>
                    {output.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-wheat">{output.title}</h3>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(imageUrl, output.key)}
                  className="p-1.5 glass-effect hover:bg-white/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-wheat" />
                </button>
              </div>

              {/* Image */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-white/10 mb-2">
                <Image
                  src={imageUrl}
                  alt={output.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Description */}
              <p className="text-xs text-wheat/60 text-center">
                {output.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 glass-effect p-4 rounded-lg border border-primary/30">
        <h4 className="font-semibold text-sm text-wheat mb-3">Analysis Guide:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-saffron font-semibold">Edge Detection:</span>
            <p className="text-wheat/70">Shows boundaries and contours of artifacts</p>
          </div>
          <div>
            <span className="text-gold font-semibold">Heat Map:</span>
            <p className="text-wheat/70">Blue (low) → Red (high) intensity</p>
          </div>
          <div>
            <span className="text-copper font-semibold">Detail Enhancement:</span>
            <p className="text-wheat/70">Highlighted surface details and textures</p>
          </div>
          <div>
            <span className="text-wheat font-semibold">Luminance:</span>
            <p className="text-wheat/70">Contrast analysis in grayscale</p>
          </div>
          <div>
            <span className="text-primary font-semibold">Texture Map:</span>
            <p className="text-wheat/70">Surface texture patterns extracted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisOutputs;

