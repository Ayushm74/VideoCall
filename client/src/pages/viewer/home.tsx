import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Coins, Video, Crown } from 'lucide-react';
import { HostCard } from '@/components/host-card';
import { VideoCallModal } from '@/components/video-call-modal';

import { useToast } from '@/hooks/use-toast';
import type { Host } from '@shared/schema';

export default function Home() {
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Mock user for demo purposes
  const mockUser = {
    id: 1,
    coinBalance: 850,
    username: "Demo User"
  };

  const { data: hosts = [], isLoading } = useQuery<Host[]>({
    queryKey: ['/api/hosts'],
  });

  const filteredHosts = hosts.filter((host: Host) =>
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineHosts = filteredHosts.filter((host: Host) => host.isOnline);
  const offlineHosts = filteredHosts.filter((host: Host) => !host.isOnline);

  const handleStartCall = (hostId: number) => {
    const host = hosts.find((h: Host) => h.id === hostId);
    if (!host) return;

    if (mockUser.coinBalance < (host.coinRate || 30)) {
      toast({
        title: 'Insufficient coins',
        description: 'Please recharge your wallet to start a call',
        variant: 'destructive',
      });
      return;
    }

    setSelectedHost(host);
    setShowCallModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-700 to-secondary">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Real conversations,
              <span className="text-accent block md:inline md:ml-4">real people</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Chat face-to-face with interesting people from around the world. No scripts, no fake profiles.
            </p>
            
            <div className="flex items-center justify-center space-x-2 gold-gradient px-6 py-3 rounded-full w-fit mx-auto mb-8">
              <Coins className="w-5 h-5 text-accent-foreground" />
              <span className="text-accent-foreground font-bold text-lg">
                {mockUser.coinBalance} coins
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold"
                onClick={() => {
                  const firstOnlineHost = onlineHosts[0];
                  if (firstOnlineHost) {
                    handleStartCall(firstOnlineHost.id);
                  }
                }}
              >
                <Video className="w-5 h-5 mr-2" />
                Start chatting
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-dark px-8 py-6 text-lg font-semibold"
              >
                <Coins className="w-5 h-5 mr-2" />
                Get coins
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search hosts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Live Hosts Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 live-pulse" />
              Available now
              <Badge variant="secondary" className="ml-3">
                {onlineHosts.length} online
              </Badge>
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-48 md:h-64 bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded mb-3 w-2/3" />
                    <div className="h-8 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : onlineHosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {onlineHosts.map((host: Host) => (
                <HostCard
                  key={host.id}
                  host={host}
                  onCall={handleStartCall}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Everyone's busy at the moment</h3>
                <p className="text-muted-foreground">Try again in a few minutes!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Offline Hosts Section */}
        {offlineHosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-muted-foreground">
              Currently away
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 opacity-60">
              {offlineHosts.map((host: Host) => (
                <HostCard
                  key={host.id}
                  host={host}
                  onCall={handleStartCall}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Video Call Modal */}
      <VideoCallModal
        isOpen={showCallModal}
        host={selectedHost}
        onClose={() => {
          setShowCallModal(false);
          setSelectedHost(null);
        }}
      />
    </div>
  );
}
