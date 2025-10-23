'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden ancient-glyph">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full border border-primary/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
            <span className="font-sans text-sm text-primary">Futuristic Archaeology Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-glow"
          >
            Where Ancient History
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer">
              Meets Artificial Intelligence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Analyze, restore, and enhance ancient artifacts and monuments using
            cutting-edge AI technology. Unlock the secrets of the past with
            super-resolution imaging and intelligent restoration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="group px-8 py-4 bg-primary hover:bg-primary-dark border border-primary rounded-lg transition-all duration-300 border-glow flex items-center space-x-2 font-sans font-semibold w-full sm:w-auto justify-center"
            >
              <span>Sign Up Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 glass-effect hover:bg-white/10 border border-primary/50 rounded-lg transition-all duration-300 font-sans font-semibold w-full sm:w-auto justify-center"
            >
              Sign In
            </Link>
          </motion.div>
          
          {/* Authentication Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-sm text-gray-400 mt-4"
          >
            🔒 Sign up required to access AI features • Free account • No credit card needed
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="font-sans text-3xl sm:text-4xl font-bold text-glow mb-2">10K+</div>
              <div className="text-sm text-gray-400">Artifacts Analyzed</div>
            </div>
            <div className="text-center">
              <div className="font-sans text-3xl sm:text-4xl font-bold text-glow-cyan mb-2">500+</div>
              <div className="text-sm text-gray-400">Museums Connected</div>
            </div>
            <div className="text-center">
              <div className="font-sans text-3xl sm:text-4xl font-bold text-glow mb-2">99%</div>
              <div className="text-sm text-gray-400">Accuracy Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating magnifying glass icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-[10%] opacity-20"
        >
          <Sparkles className="w-12 h-12 text-primary" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute top-1/3 right-[15%] opacity-20"
        >
          <Sparkles className="w-16 h-16 text-secondary" />
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 left-[20%] opacity-20"
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


