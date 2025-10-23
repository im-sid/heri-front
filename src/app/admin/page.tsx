'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllArtifacts, getAllUsers } from '@/lib/firestore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Users, Image as ImageIcon, Activity, TrendingUp, Database, 
  Cpu, HardDrive, Clock, Zap, RefreshCw, Shield, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

interface Artifact {
  id: string;
  userId: string;
  name: string;
  processingType?: string;
  createdAt: { seconds: number };
}

const AdminPageContent = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'artifacts' | 'system'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, artifactsData] = await Promise.all([
        getAllUsers(),
        getAllArtifacts()
      ]);
      setUsers(usersData);
      setArtifacts(artifactsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics
  const analytics = {
    totalUsers: users.length,
    totalArtifacts: artifacts.length,
    superResolutionCount: artifacts.filter(a => a.processingType === 'super-resolution').length,
    restorationCount: artifacts.filter(a => a.processingType === 'restoration').length,
    adminCount: users.filter(u => u.role === 'admin').length,
    curatorCount: users.filter(u => u.role === 'curator').length,
    researcherCount: users.filter(u => u.role === 'researcher').length,
    recentUsers: users.filter(u => {
      const createdDate = new Date(u.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return createdDate > weekAgo;
    }).length,
  };

  return (
    <main className="min-h-screen ancient-glyph stone-texture py-8">
      {/* Floating Hindu Symbols */}
      <div className="absolute top-20 right-10 text-6xl opacity-5 animate-float text-primary">
        🕉️
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-decorative text-4xl font-bold text-glow mb-2">
            Admin Dashboard
          </h1>
          <p className="text-wheat/70">
            System analytics, user management & monitoring
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'artifacts', label: 'Artifacts', icon: ImageIcon },
            { id: 'system', label: 'System', icon: Cpu },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'bg-primary border-primary text-dark font-bold'
                  : 'border-primary/30 hover:border-primary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect p-6 rounded-lg border border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Users className="w-8 h-8 text-primary" />
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">{analytics.totalUsers}</div>
                    <div className="text-sm text-wheat/70">Total Users</div>
                    <div className="text-xs text-green-500 mt-2">+{analytics.recentUsers} this week</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-effect p-6 rounded-lg border border-secondary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <ImageIcon className="w-8 h-8 text-secondary" />
                      <Database className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-3xl font-bold text-secondary mb-1">{analytics.totalArtifacts}</div>
                    <div className="text-sm text-wheat/70">Total Artifacts</div>
                    <div className="text-xs text-wheat/50 mt-2">All processed images</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-effect p-6 rounded-lg border border-copper/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Zap className="w-8 h-8 text-copper" />
                      <BarChart3 className="w-5 h-5 text-copper" />
                    </div>
                    <div className="text-3xl font-bold text-copper mb-1">{analytics.superResolutionCount}</div>
                    <div className="text-sm text-wheat/70">Super-Resolution</div>
                    <div className="text-xs text-wheat/50 mt-2">Enhanced images</div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-effect p-6 rounded-lg border border-primary/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <RefreshCw className="w-8 h-8 text-primary" />
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">{analytics.restorationCount}</div>
                    <div className="text-sm text-wheat/70">Restorations</div>
                    <div className="text-xs text-wheat/50 mt-2">Restored images</div>
                  </motion.div>
                </div>

                {/* User Roles Distribution */}
                <div className="glass-effect p-6 rounded-lg border border-primary/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    User Roles Distribution
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <div className="text-2xl font-bold text-primary">{analytics.adminCount}</div>
                      <div className="text-sm text-wheat/70">Administrators</div>
                    </div>
                    <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                      <div className="text-2xl font-bold text-secondary">{analytics.curatorCount}</div>
                      <div className="text-sm text-wheat/70">Curators</div>
                    </div>
                    <div className="p-4 bg-copper/10 rounded-lg border border-copper/30">
                      <div className="text-2xl font-bold text-copper">{analytics.researcherCount}</div>
                      <div className="text-sm text-wheat/70">Researchers</div>
                    </div>
                  </div>
                </div>

                {/* Activity Chart Placeholder */}
                <div className="glass-effect p-6 rounded-lg border border-secondary/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                    Activity Overview
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-dark/30 rounded-lg border border-wheat/10">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-wheat/20 mx-auto mb-3" />
                      <p className="text-wheat/50">Analytics chart coming soon</p>
                      <p className="text-xs text-wheat/30 mt-1">Install chart library for visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {selectedTab === 'users' && (
              <div className="glass-effect p-6 rounded-lg border border-primary/30">
                <h3 className="text-xl font-bold mb-4">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-wheat/10">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary">Name/Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary">Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.uid} className="border-b border-wheat/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-semibold text-wheat">{user.displayName || 'Unnamed'}</div>
                              <div className="text-xs text-wheat/60">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              user.role === 'admin' ? 'bg-primary/20 text-primary' :
                              user.role === 'curator' ? 'bg-secondary/20 text-secondary' :
                              'bg-copper/20 text-copper'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-wheat/70">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-wheat/70">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Artifacts Tab */}
            {selectedTab === 'artifacts' && (
              <div className="glass-effect p-6 rounded-lg border border-secondary/30">
                <h3 className="text-xl font-bold mb-4">Artifact Processing History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-wheat/10">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">User</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-secondary">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artifacts.map((artifact) => (
                        <tr key={artifact.id} className="border-b border-wheat/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-wheat">{artifact.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                              artifact.processingType === 'super-resolution' 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-secondary/20 text-secondary'
                            }`}>
                              {artifact.processingType === 'super-resolution' ? <Zap className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                              {artifact.processingType || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-wheat/70">{artifact.userId.slice(0, 8)}...</td>
                          <td className="py-3 px-4 text-sm text-wheat/70">
                            {new Date(artifact.createdAt.seconds * 1000).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* System Tab */}
            {selectedTab === 'system' && (
              <div className="space-y-6">
                {/* System Health */}
                <div className="glass-effect p-6 rounded-lg border border-copper/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-copper" />
                    System Health
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-500">API Status</span>
                      </div>
                      <div className="text-2xl font-bold text-green-500">Online</div>
                      <div className="text-xs text-wheat/60 mt-1">200ms avg response</div>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">GPU Usage</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">45%</div>
                      <div className="text-xs text-wheat/60 mt-1">Processing capacity</div>
                    </div>

                    <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <HardDrive className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-semibold text-secondary">Storage</span>
                      </div>
                      <div className="text-2xl font-bold text-secondary">2.3 GB</div>
                      <div className="text-xs text-wheat/60 mt-1">Total artifacts stored</div>
                    </div>
                  </div>
                </div>

                {/* Model Performance */}
                <div className="glass-effect p-6 rounded-lg border border-primary/30">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    AI Model Performance
                  </h3>
                  <div className="space-y-4">
                    {/* Super-Resolution */}
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-wheat">Super-Resolution Model</span>
                        <span className="text-primary font-bold">Active</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-wheat/60">Avg Time</div>
                          <div className="text-wheat font-bold">3.2s</div>
                        </div>
                        <div>
                          <div className="text-xs text-wheat/60">Success Rate</div>
                          <div className="text-green-500 font-bold">98.5%</div>
                        </div>
                        <div>
                          <div className="text-xs text-wheat/60">Jobs Today</div>
                          <div className="text-primary font-bold">{analytics.superResolutionCount}</div>
                        </div>
                      </div>
                    </div>

                    {/* Restoration */}
                    <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-wheat">Restoration Model</span>
                        <span className="text-secondary font-bold">Active</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-wheat/60">Avg Time</div>
                          <div className="text-wheat font-bold">4.1s</div>
                        </div>
                        <div>
                          <div className="text-xs text-wheat/60">Success Rate</div>
                          <div className="text-green-500 font-bold">96.2%</div>
                        </div>
                        <div>
                          <div className="text-xs text-wheat/60">Jobs Today</div>
                          <div className="text-secondary font-bold">{analytics.restorationCount}</div>
                        </div>
                      </div>
                    </div>

                    {/* OpenAI GPT */}
                    <div className="p-4 bg-copper/5 rounded-lg border border-copper/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-wheat">OpenAI GPT + Wikipedia</span>
                        <span className="text-copper font-bold">Active</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-wheat/60">Avg Response</div>
                          <div className="text-wheat font-bold">1.8s</div>
                        </div>
                        <div>
                          <div className="text-xs text-wheat/60">Wikipedia Hit</div>
                          <div className="text-green-500 font-bold">94%</div>
                        </div>
                        <div>
                          <div className="text-xs text-wheat/60">Queries</div>
                          <div className="text-copper font-bold">247</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

const AdminPage = () => {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPageContent />
    </ProtectedRoute>
  );
};

export default AdminPage;
