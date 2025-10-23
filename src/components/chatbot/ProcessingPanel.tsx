'use client';

import React from 'react';
import { Zap, RefreshCw, Save, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ProcessingPanelProps {
  onSuperResolution: () => void;
  onRestoration: () => void;
  onSave: () => void;
  onSciFiNarrative?: () => void;
  loading: boolean;
  disabled: boolean;
}

const ProcessingPanel: React.FC<ProcessingPanelProps> = ({
  onSuperResolution,
  onRestoration,
  onSave,
  onSciFiNarrative,
  loading,
  disabled,
}) => {
  return (
    <div className="glass-effect p-6 rounded-lg border border-primary/30" role="navigation" aria-label="AI processing options">
      <h3 className="font-serif text-xl font-bold mb-4 text-glow">
        AI Processing
      </h3>
      <div className="space-y-3" role="group">
        <button
          onClick={onSuperResolution}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Apply super-resolution to enhance image quality by 2x"
          title="Enhance image resolution (2x upscaling)"
        >
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          <span className="font-sans font-semibold">Super Resolution</span>
        </button>

        <button
          onClick={onRestoration}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-secondary/20 hover:bg-secondary/30 border border-secondary/50 rounded-lg transition-all duration-300 border-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Restore damaged or degraded areas of the image"
          title="Repair damaged image areas"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" aria-hidden="true" />
          <span className="font-sans font-semibold">Restoration</span>
        </button>

        <button
          onClick={onSave}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 glass-effect hover:bg-white/10 border border-primary/30 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          aria-label="Save current artifact to your collection"
          title="Save to collection"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          <span className="font-sans font-semibold">Save Progress</span>
        </button>

        {/* Sci-Fi Writer Mode */}
        {onSciFiNarrative && (
          <div className="mt-4 pt-4 border-t border-secondary/30">
            <h4 className="font-sans text-sm font-semibold mb-2 text-secondary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Sci-Fi Writer Mode
            </h4>
            <button
              onClick={onSciFiNarrative}
              disabled={disabled || loading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-secondary/20 to-primary/20 hover:from-secondary/30 hover:to-primary/30 border border-secondary/50 rounded-lg transition-all duration-300 border-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Generate creative sci-fi narrative"
              title="Get creative story inspiration"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
              <span className="font-sans font-semibold">Generate Story Idea</span>
            </button>
          </div>
        )}

        <Link
          href="/"
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 glass-effect hover:bg-white/10 border border-primary/30 rounded-lg transition-all duration-300 group mt-3"
          aria-label="Return to home page"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
          <span className="font-sans font-semibold">Return to Home</span>
        </Link>
      </div>

      {loading && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Processing...</span>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 glass-effect rounded-lg border border-primary/20">
        <h4 className="font-sans text-sm font-semibold mb-2 text-primary">
          Quick Guide
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Upload an artifact image</li>
          <li>• Use Super Resolution for clarity</li>
          <li>• Use Restoration for damaged areas</li>
          <li>• Chat with AI for information</li>
          <li className="text-secondary">• Try Sci-Fi Mode for story ideas</li>
        </ul>
      </div>
    </div>
  );
};

export default ProcessingPanel;


