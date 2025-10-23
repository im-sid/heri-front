'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserArtifacts } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User, Mail, Shield, Calendar, Image as ImageIcon, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProfilePageContent = () => {
  const { user, userProfile } = useAuth();
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userArtifacts = await getUserArtifacts(user.uid);
          setArtifacts(userArtifacts);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ancient-glyph relative overflow-hidden py-20">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-glow mb-2">
              Your Profile
            </h1>
            <p className="text-gray-400">Personal dashboard and activity</p>
          </div>

          {/* Profile Card */}
          <div className="glass-effect p-6 sm:p-8 rounded-lg border border-primary/30 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary">
                <User className="w-12 h-12 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold mb-2">
                  {userProfile?.displayName || 'User'}
                </h2>
                <div className="space-y-2 text-gray-400">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{userProfile?.role || 'researcher'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Member since {userProfile?.createdAt 
                        ? new Date(userProfile.createdAt).toLocaleDateString()
                        : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-effect p-6 rounded-lg border border-primary/30 text-center"
            >
              <ImageIcon className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-glow mb-1">{artifacts.length}</div>
              <div className="text-sm text-gray-400">Artifacts Uploaded</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-effect p-6 rounded-lg border border-secondary/30 text-center"
            >
              <Shield className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-glow-cyan mb-1">
                {userProfile?.role === 'admin' ? 'Admin' : 
                 userProfile?.role === 'curator' ? 'Curator' : 'Member'}
              </div>
              <div className="text-sm text-gray-400">Account Type</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-effect p-6 rounded-lg border border-primary/30 text-center"
            >
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-glow mb-1">
                {userProfile?.lastLogin 
                  ? Math.floor((new Date().getTime() - new Date(userProfile.lastLogin).getTime()) / (1000 * 60 * 60 * 24))
                  : 0}
              </div>
              <div className="text-sm text-gray-400">Days Active</div>
            </motion.div>
          </div>

          {/* User's Artifacts */}
          <div className="glass-effect p-6 sm:p-8 rounded-lg border border-primary/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-primary" />
              Your Artifacts
            </h3>

            {artifacts.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">You haven't uploaded any artifacts yet</p>
                <a
                  href="/chatbot"
                  className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                >
                  Upload Your First Artifact
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {artifacts.map((artifact, index) => (
                  <motion.div
                    key={artifact.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass-effect p-4 rounded-lg border border-primary/30 group hover:border-primary/50 transition-all"
                  >
                    <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={artifact.processedImageUrl || artifact.imageUrl}
                        alt={artifact.name || 'Artifact'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-semibold mb-1">{artifact.name || 'Artifact'}</h4>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {artifact.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{artifact.processingType || 'Original'}</span>
                      <span>
                        {artifact.createdAt?.toDate 
                          ? artifact.createdAt.toDate().toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
};

export default ProfilePage;


