'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { registerUser, loginWithGoogle } from '@/lib/auth';
import { Lock, Mail, AlertCircle, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'researcher' as 'researcher' | 'curator' | 'admin',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/chatbot');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Strong password validation (min 8 chars, 1 symbol, 1 number)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const hasNumber = /\d/.test(formData.password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    if (!hasNumber) {
      setError('Password must contain at least one number');
      return;
    }

    if (!hasSymbol) {
      setError('Password must contain at least one special character (!@#$%^&*...)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData.email, formData.password, formData.displayName, formData.role);
      toast.success(`Welcome to Heri-Science, ${formData.displayName}! Redirecting...`);
      setTimeout(() => router.push('/chatbot'), 500);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create account. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      router.push('/chatbot');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 ancient-glyph relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-effect p-8 rounded-2xl border border-primary/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4 border-glow">
              <Sparkles className="w-8 h-8 text-primary animate-glow-pulse" />
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2 text-glow">
              Join Heri-Science
            </h1>
            <p className="text-gray-400">
              Start your journey into futuristic archaeology
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-lighter border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="Dr. Indiana Jones"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-lighter border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Your Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-lighter border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              >
                <option value="researcher">Researcher</option>
                <option value="curator">Museum Curator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-lighter border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Min 8 characters, 1 number, 1 special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-lighter border border-primary/30 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark border border-primary rounded-lg transition-all duration-300 border-glow font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-primary/30"></div>
            <span className="px-4 text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-primary/30"></div>
          </div>

          {/* Google signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full py-3 glass-effect hover:bg-white/10 border border-primary/50 rounded-lg transition-all duration-300 font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-light transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;


