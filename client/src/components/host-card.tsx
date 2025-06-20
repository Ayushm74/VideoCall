import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, Crown, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Host } from '@shared/schema';

interface HostCardProps {
  host: Host;
  onCall?: (hostId: number) => void;
}

export function HostCard({ host, onCall }: HostCardProps) {
  const viewerCount = Math.floor(Math.random() * 500) + 20; // Mock viewer count

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition-all duration-300 transform hover:scale-105 cursor-pointer group">
      <div className="relative">
        <img 
          src={host.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b332c2db?ixlib=rb-4.0.3&w=400&h=500&fit=crop&crop=face'} 
          alt={host.name} 
          className="w-full h-48 md:h-64 object-cover"
        />
        
        {/* Live/Offline indicator */}
        <div className={cn(
          "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold flex items-center",
          host.isOnline 
            ? "bg-red-500 text-white live-pulse" 
            : "bg-gray-500 text-white"
        )}>
          {host.isOnline && <div className="w-2 h-2 bg-white rounded-full mr-1" />}
          {host.isOnline ? 'LIVE' : 'OFFLINE'}
        </div>

        {/* VIP Badge */}
        {host.isVerified && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground p-1 rounded-full">
            <Crown className="w-3 h-3" />
          </div>
        )}

        {/* Viewer count */}
        {host.isOnline && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            {viewerCount}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{host.name}</h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-accent text-sm">
            <Star className="w-3 h-3 mr-1 fill-current" />
            <span>{host.rating}</span>
          </div>
          <div className="text-muted-foreground text-sm flex items-center">
            <span className="text-accent font-semibold">{host.coinRate}</span>
            <span className="ml-1">coins/min</span>
          </div>
        </div>

        <Button
          onClick={() => onCall?.(host.id)}
          disabled={!host.isOnline}
          className={cn(
            "w-full text-sm font-semibold transition-opacity",
            host.isOnline 
              ? "primary-gradient hover:opacity-90" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <Video className="w-4 h-4 mr-2" />
          {host.isOnline ? 'Call Now' : 'Offline'}
        </Button>
      </div>
    </div>
  );
}
