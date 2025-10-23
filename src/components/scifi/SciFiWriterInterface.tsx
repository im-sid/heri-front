'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  createSciFiSession, 
  getSciFiSession, 
  addMessageToSciFiSession, 
  updateSciFiSession,
  SciFiSession,
  SciFiMessage 
} from '@/lib/scifiFirestore';
import { uploadImage } from '@/lib/storage';
import { API_ENDPOINTS } from '@/lib/api';
import { 
  Upload, 
  Send, 
  Sparkles, 
  BookOpen, 
  Wand2, 
  Save,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface SciFiWriterInterfaceProps {
  sessionId?: string;
}

const SciFiWriterInterface: React.FC<SciFiWriterInterfaceProps> = ({ sessionId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [session, setSession] = useState<SciFiSession | null>(null);
  const [messages, setMessages] = useState<SciFiMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['science-fiction']);
  const [customization, setCustomization] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genres = [
    { value: 'science-fiction', label: 'Science Fiction', icon: '🚀' },
    { value: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
    { value: 'space-opera', label: 'Space Opera', icon: '🌌' },
    { value: 'dystopian', label: 'Dystopian', icon: '🏙️' },
    { value: 'time-travel', label: 'Time Travel', icon: '⏰' },
    { value: 'alien-contact', label: 'Alien Contact', icon: '👽' },
    { value: 'post-apocalyptic', label: 'Post-Apocalyptic', icon: '☢️' },
    { value: 'steampunk', label: 'Steampunk', icon: '⚙️' },
    { value: 'hard-sci-fi', label: 'Hard Sci-Fi', icon: '🔬' },
    { value: 'soft-sci-fi', label: 'Soft Sci-Fi', icon: '✨' },
    { value: 'military-sci-fi', label: 'Military Sci-Fi', icon: '⚔️' },
    { value: 'biopunk', label: 'Biopunk', icon: '🧬' },
    { value: 'nanopunk', label: 'Nanopunk', icon: '🔬' },
    { value: 'solarpunk', label: 'Solarpunk', icon: '🌿' },
    { value: 'dieselpunk', label: 'Dieselpunk', icon: '🛢️' },
    { value: 'atompunk', label: 'Atompunk', icon: '☢️' },
    { value: 'retrofuturism', label: 'Retrofuturism', icon: '📻' },
    { value: 'climate-fiction', label: 'Climate Fiction', icon: '🌍' },
    { value: 'generation-ship', label: 'Generation Ship', icon: '🚢' },
    { value: 'first-contact', label: 'First Contact', icon: '🛸' },
    { value: 'parallel-universe', label: 'Parallel Universe', icon: '🌐' },
    { value: 'virtual-reality', label: 'Virtual Reality', icon: '🥽' },
    { value: 'artificial-intelligence', label: 'AI & Robots', icon: '🤖' },
    { value: 'genetic-engineering', label: 'Genetic Engineering', icon: '🧬' },
    { value: 'colonization', label: 'Space Colonization', icon: '🪐' }
  ];

  const toggleGenre = (genreValue: string) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreValue)) {
        // Don't allow removing the last genre
        if (prev.length === 1) return prev;
        return prev.filter(g => g !== genreValue);
      } else {
        return [...prev, genreValue];
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (sessionId) {
      loadSession();
    } else {
      // Create new session
      initializeNewSession();
    }
  }, [sessionId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSession = async () => {
    if (!sessionId || !user) return;
    
    try {
      const sessionData = await getSciFiSession(sessionId);
      if (sessionData && sessionData.userId === user.uid) {
        setSession(sessionData);
        setMessages(sessionData.messages || []);
        if (sessionData.artifactImageUrl) {
          setUploadedImage(sessionData.artifactImageUrl);
        }
      } else {
        toast.error('Session not found or access denied');
        router.push('/scifi-writer');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
    }
  };

  const initializeNewSession = () => {
    if (!user) return;
    
    const newSession: Omit<SciFiSession, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: user.uid,
      title: 'New Sci-Fi Story',
      description: 'Transform historical artifacts into futuristic narratives',
      messages: [],
      tags: ['sci-fi', 'creative-writing', 'artifact-based'],
      isActive: true,
      storyGenre: 'science-fiction',
      artifactType: 'unknown',
      civilization: 'unknown'
    };
    
    setSession(newSession as SciFiSession);
    setMessages([]);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateStoryIdea = async () => {
    if (!user || !uploadedImage) {
      toast.error('Please upload an artifact image first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload image to storage if it's a new file
      let imageUrl = uploadedImage;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, user.uid, 'scifi-artifacts');
      }

      // Create session if it doesn't exist
      let currentSessionId = sessionId;
      if (!currentSessionId && session && !session.id) {
        const sessionData = {
          ...session,
          title: session.title || `${selectedGenres[0].replace('-', ' ').toUpperCase()} Story - ${new Date().toLocaleDateString()}`,
          description: customization || `AI-generated ${selectedGenres.join(', ')} narrative based on historical artifact`,
          artifactImageUrl: imageUrl,
          originalImageUrl: imageUrl,
          storyGenre: selectedGenres.join(', '),
          tags: ['sci-fi', 'creative-writing', ...selectedGenres, 'artifact-based', 'ai-generated']
        };
        currentSessionId = await createSciFiSession(sessionData);
        setSession({ ...sessionData, id: currentSessionId } as SciFiSession);
        
        // Update URL
        router.replace(`/scifi-writer?sessionId=${currentSessionId}`);
      }

      // Generate story idea using AI with genre and customization
      const genresText = selectedGenres.map(g => genres.find(genre => genre.value === g)?.label).join(', ');
      const response = await fetch(API_ENDPOINTS.scifiStoryGenerate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          sessionId: currentSessionId,
          genres: selectedGenres,
          customization: customization.trim() || undefined,
          prompt: `Generate a creative story concept blending these genres: ${genresText}. Base it on this historical artifact${customization ? `. User preferences: ${customization}` : ''}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story idea');
      }

      const data = await response.json();
      
      // Add AI response to messages
      const aiMessage: Omit<SciFiMessage, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: data.storyIdea,
        type: 'story_concept',
        hasImageAnalysis: true
      };

      if (currentSessionId) {
        await addMessageToSciFiSession(currentSessionId, aiMessage);
      }
      
      setMessages(prev => [...prev, { ...aiMessage, timestamp: new Date() as any }]);
      toast.success('Story idea generated!');
      
    } catch (error) {
      console.error('Error generating story idea:', error);
      toast.error('Failed to generate story idea');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !user || isLoading) return;

    const userMessage: Omit<SciFiMessage, 'id' | 'timestamp'> = {
      role: 'user',
      content: inputMessage.trim()
    };

    setMessages(prev => [...prev, { ...userMessage, timestamp: new Date() as any }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add user message to session
      if (session?.id) {
        await addMessageToSciFiSession(session.id, userMessage);
      }

      // Get AI response
      const response = await fetch(API_ENDPOINTS.scifiChat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          sessionId: session?.id,
          context: {
            hasImage: !!uploadedImage,
            imageUrl: uploadedImage,
            previousMessages: messages.slice(-5) // Last 5 messages for context
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Omit<SciFiMessage, 'id' | 'timestamp'> = {
        role: 'assistant',
        content: data.response,
        type: data.messageType || 'story_concept'
      };

      if (session?.id) {
        await addMessageToSciFiSession(session.id, aiMessage);
        
        // Auto-save session progress
        const messageCount = messages.length + 1;
        if (messageCount % 3 === 0) {
          // Auto-save every 3 messages for story development
          await updateSciFiSession(session.id, {
            isActive: true,
            description: `Sci-Fi story in development - ${messageCount} story elements created`
          });
          
          // Show subtle auto-save notification
          toast.success('💾 Story auto-saved', { 
            duration: 2000,
            style: { fontSize: '12px' }
          });
        }
      }
      
      setMessages(prev => [...prev, { ...aiMessage, timestamp: new Date() as any }]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async () => {
    if (!session?.id || !user) return;

    try {
      const title = prompt('Enter a title for your story session:', session.title);
      if (!title) return;

      await updateSciFiSession(session.id, {
        title: title.trim(),
        messages: messages, // Save current messages
        artifactImageUrl: uploadedImage || session.artifactImageUrl,
        storyGenre: selectedGenres.join(', '),
        updatedAt: new Date() as any
      });

      setSession(prev => prev ? { ...prev, title: title.trim() } : null);
      toast.success('Session saved to gallery!');
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session');
    }
  };

  const exportStory = () => {
    if (!messages.length) {
      toast.error('No story content to export');
      return;
    }

    const storyContent = messages
      .filter(msg => msg.role === 'assistant')
      .map(msg => msg.content)
      .join('\n\n---\n\n');

    const blob = new Blob([storyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session?.title || 'sci-fi-story'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Story exported!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center ancient-glyph">
        <div className="text-center">
          <p className="text-xl text-wheat/60 mb-4">Please log in to use the Sci-Fi Writer</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ancient-glyph stone-texture relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/50">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="font-decorative text-3xl font-bold text-glow">
                  {session?.title || 'Sci-Fi Writer\'s Workshop'}
                </h1>
                <p className="text-wheat/70">Transform artifacts into futuristic narratives</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {session?.id ? (
                <>
                  <button
                    onClick={saveSession}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to Gallery
                  </button>
                  <button
                    onClick={exportStory}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </>
              ) : (
                messages.length > 0 && (
                  <button
                    onClick={async () => {
                      if (!user || !session) return;
                      
                      const title = prompt('Enter a title for your story session:', 'New Sci-Fi Story');
                      if (!title) return;

                      try {
                        const sessionData = {
                          ...session,
                          title: title.trim(),
                          messages: messages, // Include all messages
                          artifactImageUrl: uploadedImage || undefined,
                          originalImageUrl: uploadedImage || undefined,
                          storyGenre: selectedGenres.join(', '),
                          tags: ['sci-fi', 'creative-writing', ...selectedGenres, ...(session.tags || [])]
                        };
                        
                        const newSessionId = await createSciFiSession(sessionData);
                        setSession({ ...sessionData, id: newSessionId } as SciFiSession);
                        
                        // Update URL
                        router.replace(`/scifi-writer?sessionId=${newSessionId}`);
                        
                        toast.success('Session saved to gallery!');
                      } catch (error) {
                        console.error('Error creating session:', error);
                        toast.error('Failed to save session');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to Gallery
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Image Upload & Controls */}
          <div className="lg:col-span-1">
            <div className="glass-effect p-6 rounded-lg border border-purple-500/30 mb-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                Artifact Upload
              </h3>
              
              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                >
                  <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-wheat/70 mb-2">Upload Historical Artifact</p>
                  <p className="text-sm text-wheat/50">Click to select an image</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded artifact"
                    className="w-full h-64 object-cover rounded-lg border border-purple-500/30"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {uploadedImage && (
                <>
                  {/* Genre Selection */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-wheat/80 mb-2">
                      Story Genres (Select multiple)
                    </label>
                    <div className="max-h-48 overflow-y-auto bg-dark-lighter border border-purple-500/30 rounded-lg p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {genres.map(genre => (
                          <button
                            key={genre.value}
                            onClick={() => toggleGenre(genre.value)}
                            className={`px-3 py-2 rounded-lg text-sm transition-all ${
                              selectedGenres.includes(genre.value)
                                ? 'bg-purple-600 border-purple-400 text-white'
                                : 'bg-dark border-purple-500/30 text-wheat/70 hover:bg-purple-500/20'
                            } border`}
                          >
                            {genre.icon} {genre.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customization Input */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-wheat/80 mb-2">
                      Customization (Optional)
                    </label>
                    <textarea
                      value={customization}
                      onChange={(e) => setCustomization(e.target.value)}
                      placeholder="Add specific themes, characters, or settings you'd like to include..."
                      className="w-full px-3 py-2 bg-dark-lighter border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-wheat/50 resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={generateStoryIdea}
                    disabled={isLoading}
                    className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5" />
                    )}
                    Generate Story Idea
                  </button>
                </>
              )}
            </div>

            {/* Story Settings Info */}
            {uploadedImage && (
              <div className="glass-effect p-4 rounded-lg border border-purple-500/30">
                <h4 className="text-sm font-medium text-wheat/80 mb-2">Current Settings</h4>
                <div className="space-y-2 text-xs text-wheat/60">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400">Genres:</span>
                    <div className="flex-1 flex flex-wrap gap-1">
                      {selectedGenres.map(genreValue => {
                        const genre = genres.find(g => g.value === genreValue);
                        return genre ? (
                          <span key={genreValue} className="px-2 py-1 bg-purple-500/20 rounded text-xs">
                            {genre.icon} {genre.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  {customization && (
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400">Custom:</span>
                      <span className="flex-1">{customization}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-lg border border-purple-500/30 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                    <p className="text-wheat/60 text-lg">Upload an artifact to begin your sci-fi story</p>
                    <p className="text-wheat/40 text-sm mt-2">AI will analyze the artifact and generate creative story concepts</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-4 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary/20 border border-primary/50'
                            : 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/30'
                        }`}>
                          {message.type && message.role === 'assistant' && (
                            <div className="text-xs mb-2 flex items-center gap-2">
                              <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {message.type.replace('_', ' ').toUpperCase()}
                              </div>
                            </div>
                          )}
                          <div className="text-sm text-gray-300 whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Loader className="w-4 h-4 animate-spin text-purple-400" />
                            <span className="text-sm text-purple-300">AI is crafting your story...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-purple-500/30">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask for story development, character ideas, plot twists..."
                    className="flex-1 px-4 py-3 bg-dark-lighter border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-wheat/50"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SciFiWriterInterface;