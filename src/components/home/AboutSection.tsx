'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden ancient-glyph">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-glow">
              About Heri-Science
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Heri-Science is a revolutionary platform that combines the wisdom of ancient
              civilizations with the power of modern artificial intelligence. Our mission is
              to preserve, restore, and analyze historical artifacts using cutting-edge
              technology.
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Whether you're an archaeologist uncovering hidden treasures, a museum curator
              preserving cultural heritage, or a sci-fi writer seeking inspiration from
              history, Heri-Science provides the tools you need to unlock the secrets of
              the past.
            </p>

              <div className="space-y-4">
              <div className="glass-effect p-4 rounded-lg border border-primary/20 mb-4">
                <p className="text-center text-sm text-primary mb-2">
                  🔐 <strong>Authentication Required</strong>
                </p>
                <p className="text-center text-xs text-gray-400">
                  Sign up free to unlock all AI features • No credit card • Instant access
                </p>
              </div>

              <div className="flex items-start space-x-4 glass-effect p-4 rounded-lg border border-primary/20">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold mb-1">Our Mission</h4>
                  <p className="text-gray-400 text-sm">
                    To democratize access to advanced AI tools for historical preservation
                    and research worldwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 glass-effect p-4 rounded-lg border border-secondary/20">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold mb-1">Who We Serve</h4>
                  <p className="text-gray-400 text-sm">
                    Archaeologists, museum curators, researchers, and creative professionals
                    exploring history.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 glass-effect p-4 rounded-lg border border-primary/20">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-sans font-semibold mb-1">Our Technology</h4>
                  <p className="text-gray-400 text-sm">
                    State-of-the-art deep learning models trained on millions of historical
                    artifacts and documents.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-effect p-8 rounded-2xl border border-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              <div className="relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-dark/80 rounded-lg border border-primary/30">
                    <span className="font-sans text-sm">Super-Resolution AI</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark/80 rounded-lg border border-secondary/30">
                    <span className="font-sans text-sm">Restoration Engine</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-dark/80 rounded-lg border border-primary/30">
                    <span className="font-sans text-sm">Historical Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                  </div>
                  <div className="p-6 bg-dark/80 rounded-lg border border-primary/30 text-center">
                    <div className="text-4xl font-bold text-glow mb-2">24/7</div>
                    <div className="text-sm text-gray-400">AI Processing Available</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


