'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { useSearchParams } from 'next/navigation';
import { 
  createProcessingSession, 
  getProcessingSession, 
  updateProcessingSession,
  addMessageToProcessingSession,
  ProcessingSession 
} from '@/lib/firestore';
import { uploadImage } from '@/lib/storage';
import ImageUpload from '@/components/chatbot/ImageUpload';
import ImageComparison from '@/components/chatbot/ImageComparison';
import ProgressBar from '@/components/chatbot/ProgressBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Download, Zap, RefreshCw, Send, Sparkles, Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGalleryRefresh } from '@/hooks/useGalleryRefresh';


const ChatbotPageContent = () => {
  const { user } = useAuth();
  const { processImage, loading } = useImageProcessing();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const { triggerRefresh } = useGalleryRefresh();
  
  const [currentSession, setCurrentSession] = useState<ProcessingSession | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'What can I help with?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Load existing session if sessionId is provided
  useEffect(() => {
    if (sessionId && user) {
      loadSession();
    }
  }, [sessionId, user]);

  const loadSession = async () => {
    if (!sessionId || !user) return;
    
    setSessionLoading(true);
    try {
      const session = await getProcessingSession(sessionId);
      if (session && session.userId === user.uid) {
        setCurrentSession(session);
        setCurrentImageUrl(session.originalImageUrl);
        setProcessedImageUrl(session.processedImageUrl || null);
        
        // Load chat messages
        if (session.chatMessages && session.chatMessages.length > 0) {
          const chatMessages = session.chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }));
          setMessages([
            { role: 'assistant', content: `✅ Session "${session.name}" loaded! Continue where you left off.${session.processingType ? ` Processing: ${session.processingType.replace('-', ' ')}` : ''}` },
            ...chatMessages
          ]);
        } else {
          // No chat messages, just show welcome message
          setMessages([
            { role: 'assistant', content: `✅ Session "${session.name}" loaded! ${session.processedImageUrl ? 'Your processed image is ready.' : 'Upload an image to continue processing.'}` }
          ]);
        }
        
        toast.success(`Session "${session.name}" loaded!`);
      } else {
        toast.error('Session not found or access denied');
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
    } finally {
      setSessionLoading(false);
    }
  };

  const saveSession = async () => {
    if (!user || !currentImageUrl) {
      toast.error('Please upload an image first');
      return;
    }

    if (!processedImageUrl) {
      toast.error('Please process the image first (Super-Resolution or Restoration)');
      return;
    }

    const sessionName = prompt('Enter a name for this session:', currentSession?.name || 'AI Lab Session');
    if (!sessionName) return;

    const toastId = toast.loading('Saving session...');
    
    try {
      let imageUrl = currentImageUrl;
      let processedUrl = processedImageUrl;

      // Upload images to storage if they're blob URLs
      if (selectedFile && currentImageUrl.startsWith('blob:')) {
        imageUrl = await uploadImage(selectedFile, user.uid, 'processing-sessions');
      }

      // Convert messages to the correct format
      const chatMessages = messages.slice(1).map(msg => ({
        userId: user.uid,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: new Date() as any
      }));

      if (currentSession?.id) {
        // Update existing session
        await updateProcessingSession(currentSession.id, {
          name: sessionName,
          originalImageUrl: imageUrl,
          processedImageUrl: processedUrl || undefined,
          chatMessages: chatMessages,
          isActive: true
        });
        
        setCurrentSession(prev => prev ? { ...prev, name: sessionName } : null);
        toast.success('Session updated!', { id: toastId });
        triggerRefresh(); // Notify gallery to refresh
      } else {
        // Determine processing type based on current session or processed image
        let processingType: 'super-resolution' | 'restoration' | undefined = undefined;
        if (currentSession?.processingType) {
          processingType = currentSession.processingType;
        } else if (processedUrl) {
          // Default to super-resolution if we have a processed image but no type
          processingType = 'super-resolution';
        }

        // Create new session
        const sessionData = {
          userId: user.uid,
          name: sessionName,
          description: `AI Lab session - ${processingType ? processingType.replace('-', ' ') : 'image analysis'}`,
          originalImageUrl: imageUrl,
          processedImageUrl: processedUrl || undefined,
          processingType: processingType,
          chatMessages: chatMessages,
          tags: ['ai-lab', 'processing', ...(processingType ? [processingType] : [])],
          isActive: true
        };

        const newSessionId = await createProcessingSession(sessionData);
        setCurrentSession({ ...sessionData, id: newSessionId } as ProcessingSession);
        
        // Update URL to include session ID
        window.history.replaceState({}, '', `/chatbot?sessionId=${newSessionId}`);
        
        toast.success('Session saved!', { id: toastId });
      }
    } catch (error) {
      console.error('Error saving session:', error);
      toast.error('Failed to save session', { id: toastId });
    }
  };

  const handleImageSelect = async (file: File) => {
    setSelectedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setCurrentImageUrl(imageUrl);
    setProcessedImageUrl(null);
    
    // Add message when image is received
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '📸 Image received! Do you want to know anything about it?' 
    }]);
    
    toast.success('Image uploaded! Auto-analyzing...');
    
    // AUTO-ANALYZE IMAGE AND GET WIKIPEDIA INFO
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auto-analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64data })
        });
        
        const data = await response.json();
        
        if (data.success && data.analysis) {
          // Add automatic analysis to chat - only if there's meaningful info
          let autoMessage = '';
          
          if (data.analysis.detected_type) {
            autoMessage += `🔍 Detected: ${data.analysis.detected_type}\n\n`;
          }
          
          if (data.analysis.wikipedia_info) {
            const wiki = data.analysis.wikipedia_info;
            autoMessage += `📚 **${wiki.title}**\n\n`;
            autoMessage += `${wiki.summary}\n\n`;
            autoMessage += `🔗 [Read more](${wiki.url})`;
          }
          
          // Only add message if there's content
          if (autoMessage.trim()) {
            setMessages(prev => [...prev, { role: 'assistant', content: autoMessage }]);
            toast.success('Analysis complete!');
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Auto-analysis error:', error);
      toast.error('Auto-analysis failed. You can still enhance the image!');
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setCurrentImageUrl(null);
    setProcessedImageUrl(null);
    toast.success('Ready for new image');
  };

  const handleSuperResolution = async () => {
    if (!selectedFile || !user) {
      toast.error('Please upload an image first');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading('Enhancing with Super-Resolution...');

    // Progress tracking for 6-stage pipeline
    setProgress(0);
    setProgressStatus('Initializing...');
    
    setTimeout(() => { setProgress(16); setProgressStatus('Stage 1/6: Pre-processing...'); }, 100);
    setTimeout(() => { setProgress(33); setProgressStatus('Stage 2/6: LANCZOS 2x Upscaling...'); }, 400);
    setTimeout(() => { setProgress(50); setProgressStatus('Stage 3/6: Edge-Preserving Sharpening...'); }, 900);
    setTimeout(() => { setProgress(66); setProgressStatus('Stage 4/6: Adaptive Contrast...'); }, 1400);
    setTimeout(() => { setProgress(83); setProgressStatus('Stage 5/6: Unsharp Masking (Detail)...'); }, 1900);
    setTimeout(() => { setProgress(95); setProgressStatus('Stage 6/6: Final Optimization...'); }, 2500);

    const result = await processImage(selectedFile, 'super-resolution', 75);
    
    setProgress(100);
    setProgressStatus('Complete!');
    setTimeout(() => { setProgress(0); setProgressStatus(''); }, 1000);
    setProcessing(false);

    if (result) {
      toast.success('Super-Resolution complete!', { id: toastId });
      setProcessedImageUrl(result.processedImageUrl);
      
      // Show save notification
      setTimeout(() => {
        toast.success('💾 You can now save this session to your gallery!', {
          duration: 4000,
          style: { fontSize: '14px' }
        });
      }, 1000);
      
      // Update session with processed image
      if (currentSession?.id) {
        try {
          await updateProcessingSession(currentSession.id, {
            processedImageUrl: result.processedImageUrl,
            processingType: 'super-resolution'
          });
        } catch (error) {
          console.error('Error updating session:', error);
        }
      }
    } else {
      toast.error('Enhancement failed. Please try again.', { id: toastId });
    }
  };

  const handleRestoration = async () => {
    if (!selectedFile || !user) {
      toast.error('Please upload an image first');
      return;
    }

    setProcessing(true);
    const toastId = toast.loading('Restoring image...');

    // Progress tracking for 8-stage pipeline
    setProgress(0);
    setProgressStatus('Initializing...');
    
    setTimeout(() => { setProgress(12); setProgressStatus('Stage 1/8: Image Analysis...'); }, 100);
    setTimeout(() => { setProgress(25); setProgressStatus('Stage 2/8: Adaptive Denoising...'); }, 400);
    setTimeout(() => { setProgress(37); setProgressStatus('Stage 3/8: Edge-Preserving Sharpening...'); }, 800);
    setTimeout(() => { setProgress(50); setProgressStatus('Stage 4/8: Adaptive Contrast...'); }, 1200);
    setTimeout(() => { setProgress(62); setProgressStatus('Stage 5/8: Color Restoration...'); }, 1600);
    setTimeout(() => { setProgress(75); setProgressStatus('Stage 6/8: Detail Enhancement...'); }, 2000);
    setTimeout(() => { setProgress(87); setProgressStatus('Stage 7/8: Brightness Correction...'); }, 2400);
    setTimeout(() => { setProgress(95); setProgressStatus('Stage 8/8: Final Polish...'); }, 2800);

    const result = await processImage(selectedFile, 'restoration', 75);
    
    setProgress(100);
    setProgressStatus('Complete!');
    setTimeout(() => { setProgress(0); setProgressStatus(''); }, 1000);
    setProcessing(false);

    if (result) {
      toast.success('Restoration complete!', { id: toastId });
      setProcessedImageUrl(result.processedImageUrl);
      
      // Show save notification
      setTimeout(() => {
        toast.success('💾 You can now save this session to your gallery!', {
          duration: 4000,
          style: { fontSize: '14px' }
        });
      }, 1000);
      
      // Update session with processed image
      if (currentSession?.id) {
        try {
          await updateProcessingSession(currentSession.id, {
            processedImageUrl: result.processedImageUrl,
            processingType: 'restoration'
          });
        } catch (error) {
          console.error('Error updating session:', error);
        }
      }
    } else {
      toast.error('Restoration failed. Please try again.', { id: toastId });
    }
  };

  const handleDownload = () => {
    if (!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `heri-science-enhanced-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started!');
  };

  const convertImageToBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
      // If it's already a data URL, return as is
      if (imageUrl.startsWith('data:')) {
        return imageUrl;
      }
      
      // Convert Firebase Storage URL or other URLs to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    // Save user message to session if exists
    if (currentSession?.id && user) {
      try {
        await addMessageToProcessingSession(currentSession.id, {
          userId: user.uid,
          role: 'user',
          content: userMsg
        });
      } catch (error) {
        console.error('Error saving user message:', error);
      }
    }

    try {
      let apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/historical-info`;
      let requestBody: any = {
        query: userMsg,
        artifact_type: 'artifact',
        context: { 
          hasImage: !!(processedImageUrl || currentImageUrl),
          imageUrl: processedImageUrl || currentImageUrl || ''
        }
      };

      // If we have a processed image, use Gemini for visual analysis
      if (processedImageUrl) {
        console.log('Using Gemini for image analysis...');
        apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/gemini-chat`;
        
        // Use the processed image URL directly (no base64 conversion needed)
        let imageUrlForAnalysis = processedImageUrl;
        console.log('Using processed image URL directly for Gemini analysis');

        requestBody = {
          message: userMsg,
          context: {
            hasImage: true,
            imageUrl: imageUrlForAnalysis,
            imageMode: true,
            processingType: currentSession?.processingType || 'super-resolution',
            sessionName: currentSession?.name || 'AI Lab Session',
            previousMessages: messages.slice(-5)
          }
        };
      }

      console.log(`Sending request to ${apiEndpoint}:`, requestBody);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      setChatLoading(false);

      const aiResponse = data.response || data.information || 'Sorry, I couldn\'t process that. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Save AI response to session if exists
      if (currentSession?.id && user) {
        try {
          await addMessageToProcessingSession(currentSession.id, {
            userId: user.uid,
            role: 'assistant',
            content: aiResponse
          });
          
          // Auto-save session after every few messages
          const messageCount = messages.length + 1; // +1 for the new message
          if (messageCount % 5 === 0) {
            // Auto-save every 5 messages
            await updateProcessingSession(currentSession.id, {
              isActive: true,
              description: `AI Lab session - ${messageCount} messages exchanged`
            });
            
            // Show subtle auto-save notification
            toast.success('💾 Session auto-saved', { 
              duration: 2000,
              style: { fontSize: '12px' }
            });
          }
        } catch (error) {
          console.error('Error saving AI message:', error);
        }
      }
    } catch (error) {
      setChatLoading(false);
      const errorMsg = 'Error connecting to AI. Please check if backend is running.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    }
  };


  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 text-glow-copper">
                {currentSession ? currentSession.name : 'Heri-Science AI Lab'}
              </h1>
              <p className="text-xl text-gray-400">
                Professional Image Enhancement for Historical Artifacts
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              {user && processedImageUrl && (
                <button
                  onClick={saveSession}
                  disabled={sessionLoading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {sessionLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {currentSession ? 'Save to Gallery' : 'Save to Gallery'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STEP 1: Upload */}
        <section className="glass-effect p-8 rounded-lg border-2 border-primary/50">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Step 1: Upload Your Image
          </h2>
          <ImageUpload
            onImageSelect={handleImageSelect}
            currentImage={currentImageUrl}
            onClearImage={handleClearImage}
          />
        </section>

        {/* STEP 2: Choose Enhancement - TWO BIG OPTIONS */}
        {currentImageUrl && !processedImageUrl && (
          <section className="glass-effect p-8 rounded-lg border-2 border-secondary/50">
            <h2 className="text-3xl font-bold mb-6 text-center text-glow-copper">
              Step 2: Choose Enhancement Type
            </h2>
            
            <p className="text-center text-gray-400 mb-8">
              Select one option below to process your image
            </p>

            {/* Progress Bar */}
            {progress > 0 && progress < 100 && (
              <div className="mb-8 glass-effect p-6 rounded-lg border-2 border-primary/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-bold text-primary">Processing with Professional Algorithms</h3>
                </div>
                <ProgressBar
                  progress={progress}
                  status={progressStatus}
                  color="primary"
                />
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">Python multi-stage pipeline running...</span>
                  <span className="text-primary font-mono font-bold">{progress}%</span>
                </div>
              </div>
            )}

            {/* TWO BIG OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* OPTION 1: SUPER RESOLUTION */}
              <button
                onClick={handleSuperResolution}
                disabled={processing}
                className="relative p-10 bg-gradient-to-br from-primary/30 to-primary/10 hover:from-primary/40 hover:to-primary/20 border-4 border-primary rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-glow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-6 right-6 w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                  1
                </div>
                
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-primary/40 rounded-full flex items-center justify-center">
                    <Zap className="w-12 h-12 text-primary" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-primary">
                    Super-Resolution
                  </h3>
                  
                  <p className="text-gray-300 text-lg">
                    Increase image resolution by 2x using LANCZOS algorithm
                  </p>
                  
                  <div className="space-y-3 text-left w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-gray-300">2x Resolution Increase</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-gray-300">Sharpness Enhancement</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-gray-300">Best for Blurry/Low-Res Images</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 px-8 py-3 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-dark transition-colors">
                    CLICK TO ENHANCE
                  </div>
                </div>
              </button>

              {/* OPTION 2: RESTORATION */}
              <button
                onClick={handleRestoration}
                disabled={processing}
                className="relative p-10 bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/40 hover:to-secondary/20 border-4 border-secondary rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-glow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-6 right-6 w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center text-3xl font-bold text-secondary">
                  2
                </div>
                
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-secondary/40 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-12 h-12 text-secondary" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-secondary">
                    Image Restoration
                  </h3>
                  
                  <p className="text-gray-300 text-lg">
                    Repair and restore damaged or faded images
                  </p>
                  
                  <div className="space-y-3 text-left w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-gray-300">Damage Repair</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-gray-300">Color Restoration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-secondary rounded-full"></div>
                      <span className="text-gray-300">Best for Old/Damaged Photos</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 px-8 py-3 bg-secondary text-white rounded-full font-bold text-lg hover:bg-secondary-dark transition-colors">
                    CLICK TO RESTORE
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Both options use Python PIL algorithms for fast, reliable results
              </p>
            </div>
          </section>
        )}

        {/* STEP 3: Comparison & Download */}
        {currentImageUrl && processedImageUrl && (
          <section className="glass-effect p-8 rounded-lg border-2 border-primary/50">
            <h2 className="text-3xl font-bold mb-6 text-center text-glow-copper">
              Step 3: Compare & Download
            </h2>
            
            <ImageComparison
              originalImage={currentImageUrl}
              processedImage={processedImageUrl}
              onDownload={handleDownload}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dark rounded-lg transition-all font-bold text-lg"
              >
                <Download className="w-6 h-6" />
                Download Enhanced Image
              </button>
              

              
              <button
                onClick={() => {
                  setProcessedImageUrl(null);
                  toast.success('Ready for another enhancement');
                }}
                className="flex items-center justify-center gap-3 px-8 py-4 glass-effect hover:bg-white/10 border-2 border-secondary rounded-lg transition-all font-bold text-lg"
              >
                <RefreshCw className="w-6 h-6" />
                Process Another Image
              </button>
            </div>
          </section>
        )}

        {/* GEMINI CHATBOT - Ask questions about your images */}
        <section className="glass-effect rounded-lg border-2 border-secondary/50 overflow-hidden">
          {/* Chatbot Header */}
          <div className="bg-gradient-to-r from-secondary/20 to-primary/20 p-6 border-b border-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-glow-cyan">
                  {processedImageUrl ? 'Gemini AI Assistant' : 'AI Assistant'}
                </h2>
                <p className="text-sm text-gray-400">
                  {processedImageUrl 
                    ? 'Powered by Gemini Vision - Analyzing your enhanced image'
                    : 'Upload and process an image to enable Gemini visual analysis'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[400px] overflow-y-auto bg-dark/30 p-6 space-y-4">
            {processedImageUrl && (
              <div className="text-center py-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/30 rounded-full text-sm">
                  <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="text-blue-300">Gemini Vision AI Active - Ask about your enhanced image</span>
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 border border-primary/50' 
                    : processedImageUrl 
                      ? 'bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30'
                      : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30'
                }`}>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-dark/50 border-t border-secondary/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={processedImageUrl 
                  ? "Ask Gemini about this enhanced image: What do you see? What's its significance?"
                  : "Ask me about the image, artifact history, or anything..."
                }
                className="flex-1 px-4 py-3 bg-dark-lighter border border-secondary/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="font-semibold">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Example: "What can you tell me about this artifact?" or "Explain the historical significance"
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

const ChatbotPage = () => {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-dark">
          <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
      }>
        <ChatbotPageContent />
      </Suspense>
    </ProtectedRoute>
  );
};

export default ChatbotPage;
