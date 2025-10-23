'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/30 glass-effect mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-lg font-bold text-glow mb-4">
              Heri-Science
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Bridging ancient history with cutting-edge AI technology to restore,
              analyze, and preserve our cultural heritage for future generations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-primary mb-4">
              QUICK LINKS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/chatbot"
                  className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                >
                  AI Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-sans text-sm font-semibold text-primary mb-4">
              CONNECT WITH US
            </h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="mailto:contact@heri-science.com"
                className="p-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              <a
                href="mailto:contact@heri-science.com"
                className="hover:text-primary transition-colors duration-300"
              >
                contact@heri-science.com
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm font-sans">
            © {currentYear} Heri-Science v1.0 • All rights reserved • Futuristic Archaeology
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Ancient Meets AI • Built with ❤️ for preserving history
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


