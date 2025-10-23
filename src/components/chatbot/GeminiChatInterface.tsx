'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { 
  Send, 
  Upload, 
  Sparkles, 
  Bot,
  User,
  Image as ImageIcon,
  Loader,
  RefreshCw,
  Download,
  Copy,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasImage?: boolean;
  imageUrl?: string;
}

interface GeminiChatInterfaceProps {
  imageUrl?: string;
  processingType?: 'super-resolution' | 'restoration';
  sessionName?: string;
}

const GeminiChatInterface: React.FC<GeminiChatInterfaceProps> = ({ 
  imageUrl: propImageUrl, 
  processingType, 
  sessionName 
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(propImageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageMode, setImageMode] = useState<boolean>(!!propImageUrl);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('GeminiChatInterface props:', {
      imageUrl: propImageUrl,
      processingType,
      sessionName,
      imageMode: !!propImageUrl
    });
  }, [propImageUrl, processingType, sessionName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      let welcomeContent = '';
      
      if (imageMode && uploadedImage) {
        welcomeContent = `🖼️ **Image Analysis Mode - Gemini Chat**

I can see you've ${processingType === 'super-resolution' ? 'enhanced' : processingType === 'restoration' ? 'restored' : 'uploaded'} an image${sessionName ? ` from "${sessionName}"` : ''}! 

I'm now focused on helping you analyze this image. I can help with:

• **Artifact Identification** - What type of historical object is this?
• **Historical Context** - When and where was this created?
• **Cultural Significance** - What does this tell us about the civilization?
• **Technical Analysis** - Materials, construction methods, artistic style
• **Comparative Analysis** - How does this relate to similar artifacts?
• **Research Guidance** - What should you investigate further?

Ask me anything about this image - I'm here to provide detailed historical and archaeological insights!`;
      } else {
        welcomeContent = `🤖 **Welcome to Gemini Chat!**

I'm your AI assistant powered by Google's Gemini model. I can help you with:

• **Historical Analysis** - Upload artifacts and get detailed insights
• **Research Questions** - Ask about ancient civilizations, archaeology, and history  
• **Creative Writing** - Brainstorm ideas and develop stories
• **General Knowledge** - Answer questions on a wide range of topics

Feel free to upload an image or just start chatting! How can I help you today?`;
      }

      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date(),
        hasImage: imageMode,
        imageUrl: uploadedImage || undefined
      };
      setMessages([welcomeMessage]);
    }
  }, [imageMode, uploadedImage, processingType, sessionName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    
    toast.success('Image uploaded! You can now ask questions about it.');
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

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // In image mode, check if the question is related to the image
    if (imageMode && uploadedImage) {
      const imageRelatedKeywords = [
        'image', 'picture', 'artifact', 'object', 'this', 'what', 'who', 'when', 'where', 'how', 'why',
        'historical', 'ancient', 'civilization', 'culture', 'material', 'construction', 'style',
        'period', 'era', 'origin', 'significance', 'meaning', 'purpose', 'function', 'technique',
        'analysis', 'identify', 'describe', 'explain', 'tell me', 'about', 'see', 'visible'
      ];
      
      const messageWords = inputMessage.toLowerCase().split(/\s+/);
      const hasImageRelatedContent = imageRelatedKeywords.some(keyword => 
        messageWords.some(word => word.includes(keyword))
      );
      
      if (!hasImageRelatedContent) {
        toast.error('Please ask questions related to the uploaded image');
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      hasImage: !!uploadedImage,
      imageUrl: uploadedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Convert image to base64 if needed
      let imageUrlForAnalysis = uploadedImage;
      if (uploadedImage && !uploadedImage.startsWith('data:')) {
        console.log('Converting image to base64 for Gemini analysis...');
        const base64Image = await convertImageToBase64(uploadedImage);
        if (base64Image) {
          imageUrlForAnalysis = base64Image;
          console.log('Successfully converted image to base64');
        } else {
          console.warn('Failed to convert image to base64, using original URL');
        }
      }

      const requestBody = {
        message: inputMessage.trim(),
        context: {
          hasImage: !!uploadedImage,
          imageUrl: imageUrlForAnalysis,
          imageMode: imageMode,
          processingType: processingType,
          sessionName: sessionName,
          previousMessages: messages.slice(-5) // Last 5 messages for context
        }
      };

      console.log('Sending to Gemini API:', requestBody);

      const response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again or check your connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUploadedImage(null);
    setImageFile(null);
    toast.success('Chat cleared');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  const exportChat = () => {
    if (!messages.length) {
      toast.error('No messages to export');
      return;
    }

    const chatContent = messages
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n---\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported!');
  };

  return (
    <div className="min-h-screen ancient-glyph stone-texture relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {imageMode && (
                <button
                  onClick={() => router.back()}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-blue-500/50">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="font-decorative text-3xl font-bold text-glow">
                  {imageMode ? 'Image Analysis - Gemini AI' : 'Gemini AI Chat'}
                </h1>
                <p className="text-wheat/70">
                  {imageMode 
                    ? `Analyzing ${processingType === 'super-resolution' ? 'enhanced' : processingType === 'restoration' ? 'restored' : 'uploaded'} image`
                    : 'Powered by Google\'s Gemini AI'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={exportChat}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={clearChat}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Image Display Section - Only show in image mode */}
        {imageMode && uploadedImage && (
          <div className="glass-effect rounded-lg border border-blue-500/30 mb-6 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img
                  src={uploadedImage}
                  alt="Uploaded artifact"
                  className="w-32 h-32 object-cover rounded-lg border border-blue-500/30"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-400 mb-2">
                  {processingType === 'super-resolution' ? '🔍 Enhanced Image' : 
                   processingType === 'restoration' ? '🔧 Restored Image' : 
                   '📸 Uploaded Image'}
                </h3>
                <p className="text-wheat/70 text-sm mb-2">
                  {sessionName && `From session: ${sessionName}`}
                </p>
                <p className="text-wheat/60 text-sm">
                  Ask me anything about this artifact - I can help identify it, explain its historical context, 
                  analyze its construction, and provide insights about the civilization that created it.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="glass-effect rounded-lg border border-blue-500/30 h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-lg relative group ${
                    message.role === 'user'
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-gradient-to-br from-blue-500/10 via-green-500/10 to-blue-500/10 border border-blue-500/30'
                  }`}>
                    {/* Message Header */}
                    <div className="flex items-center gap-2 mb-2">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-primary" />
                      ) : (
                        <Bot className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-xs text-wheat/60">
                        {message.role === 'user' ? 'You' : 'Gemini AI'}
                      </span>
                      <span className="text-xs text-wheat/40">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      
                      {/* Copy button */}
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Image if present */}
                    {message.hasImage && message.imageUrl && (
                      <div className="mb-3">
                        <img
                          src={message.imageUrl}
                          alt="Uploaded"
                          className="max-w-xs rounded-lg border border-primary/30"
                        />
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-br from-blue-500/10 via-green-500/10 to-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin text-blue-400" />
                      <span className="text-sm text-blue-300">Gemini is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Image Upload Area */}
          {uploadedImage && (
            <div className="px-6 py-3 border-t border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-3">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-12 h-12 object-cover rounded border border-blue-500/30"
                />
                <div className="flex-1">
                  <p className="text-sm text-blue-300">Image uploaded</p>
                  <p className="text-xs text-wheat/60">Ask questions about this image</p>
                </div>
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    setImageFile(null);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-6 border-t border-blue-500/30">
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={imageMode 
                  ? "Ask about this image: What is it? When was it made? What's its significance?" 
                  : "Ask Gemini anything about history, artifacts, or general questions..."
                }
                className="flex-1 px-4 py-3 bg-dark-lighter border border-blue-500/30 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-wheat/50"
                disabled={isLoading}
              />
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatInterface;