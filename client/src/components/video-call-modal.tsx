import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mic, MicOff, Video, VideoOff, MessageCircle, Gift } from 'lucide-react';

import { GiftCatalog } from '@/components/gift-catalog';
import type { Host } from '@shared/schema';

interface VideoCallModalProps {
  isOpen: boolean;
  host: Host | null;
  onClose: () => void;
}

export function VideoCallModal({ isOpen, host, onClose }: VideoCallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [coinsSpent, setCoinsSpent] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Mock user for demo purposes
  const mockUser = {
    id: 1,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&h=200&fit=crop&crop=face',
    username: 'Demo User',
    coinBalance: 850
  };

  useEffect(() => {
    if (!isOpen || !host) return;

    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
      setCoinsSpent(prev => prev + (host.coinRate || 30));
    }, 60000); // Increment every minute

    return () => clearInterval(interval);
  }, [isOpen, host]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setCallDuration(0);
      setCoinsSpent(0);
      setShowGifts(false);
      setShowChat(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !host) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative w-full h-full">
        {/* Main video area */}
        <div className="absolute inset-0">
          <img 
            src={host.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop'} 
            alt="Video Call" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
        </div>

        {/* User's video (picture-in-picture) */}
        {!isVideoOff && (
          <div className="absolute top-4 right-4 w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-accent">
            <img 
              src={mockUser.avatar} 
              alt="Your Video" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Call info overlay */}
        <div className="absolute top-4 left-4 space-y-3">
          <div className="glass-card px-4 py-2 rounded-full flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-semibold">{formatDuration(callDuration)}</span>
          </div>
          
          <div className="gold-gradient px-4 py-2 rounded-full flex items-center space-x-2 coin-bounce">
            <span className="text-accent-foreground font-bold">-{coinsSpent}</span>
            <span className="text-accent-foreground text-sm">coins</span>
          </div>
        </div>

        {/* Host info */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="glass-card px-6 py-3 rounded-full text-center">
            <h3 className="font-bold text-lg">{host.name}</h3>
            <p className="text-sm text-muted-foreground">{host.coinRate} coins/min</p>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground p-4 rounded-full gift-float"
              onClick={() => setShowGifts(!showGifts)}
            >
              <Gift className="w-6 h-6" />
            </Button>
            
            <Button
              size="lg"
              variant={isMuted ? "destructive" : "secondary"}
              className="p-4 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            
            <Button
              size="lg"
              variant="destructive"
              className="p-4 rounded-full transform hover:scale-110 transition-transform"
              onClick={onClose}
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </Button>
            
            <Button
              size="lg"
              variant={isVideoOff ? "destructive" : "secondary"}
              className="p-4 rounded-full"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </Button>
            
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 p-4 rounded-full"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Gift panel */}
        {showGifts && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Send a Gift</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGifts(false)}
                  >
                    ✕
                  </Button>
                </div>
                <GiftCatalog 
                  hostId={host.id} 
                  onGiftSent={() => setShowGifts(false)}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat panel */}
        {showChat && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-80 h-96">
            <Card className="glass-card h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Chat</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(false)}
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <span className="font-semibold text-accent">{host.name}:</span>
                      <span className="ml-2">Hi there! 👋</span>
                    </div>
                    <div className="bg-primary/20 rounded-lg p-2">
                      <span className="font-semibold text-primary">You:</span>
                      <span className="ml-2">Hello!</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm"
                  />
                  <Button size="sm" className="primary-gradient">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
