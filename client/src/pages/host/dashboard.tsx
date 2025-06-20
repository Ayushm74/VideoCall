import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  Phone, 
  Star, 
  Users, 
  Coins,
  Award,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function HostDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock host data - in a real app, this would come from the authenticated host
  const hostId = 1; // This would be determined from auth

  const { data: host } = useQuery({
    queryKey: ['/api/host', hostId],
  });

  const { data: calls = [] } = useQuery({
    queryKey: ['/api/host', hostId, 'calls'],
    enabled: !!hostId,
  });

  const toggleOnlineMutation = useMutation({
    mutationFn: async (online: boolean) => {
      await apiRequest('POST', `/api/host/${hostId}/status`, { isOnline: online });
      return online;
    },
    onSuccess: (online) => {
      setIsOnline(online);
      toast({
        title: online ? 'You are now live! 🎉' : 'You went offline',
        description: online 
          ? 'Users can now see you and start calls' 
          : 'You are no longer visible to users',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/host'] });
    },
    onError: () => {
      toast({
        title: 'Status update failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    },
  });

  const stats = [
    {
      title: "Today's Earnings",
      value: "₹2,450",
      change: "+12%",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    {
      title: "Total Calls",
      value: "28",
      change: "This week",
      icon: Phone,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Rating",
      value: "4.9",
      change: "156 reviews",
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    {
      title: "Total Fans",
      value: "1,234",
      change: "+45 this week",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    }
  ];

  const recentCalls = [
    { user: "Rahul K.", duration: "15:30", earnings: "₹775", time: "2 hours ago" },
    { user: "Amit S.", duration: "8:45", earnings: "₹437", time: "4 hours ago" },
    { user: "Priya M.", duration: "22:15", earnings: "₹1,112", time: "6 hours ago" },
    { user: "Suresh R.", duration: "5:20", earnings: "₹267", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900/20 via-background to-cyan-900/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your hosting activity
            </p>
          </div>
          
          {/* Go Live Toggle */}
          <Card className={`p-4 ${isOnline ? 'border-green-500 bg-green-500/10' : 'border-muted'}`}>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold mb-1">
                  {isOnline ? 'LIVE' : 'OFFLINE'}
                </div>
                <Badge variant={isOnline ? 'default' : 'secondary'} className={isOnline ? 'bg-green-500' : ''}>
                  {isOnline ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <Switch
                checked={isOnline}
                onCheckedChange={(checked) => toggleOnlineMutation.mutate(checked)}
                disabled={toggleOnlineMutation.isPending}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Calls */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Recent Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{call.user}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {call.duration}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">{call.earnings}</div>
                      <div className="text-xs text-muted-foreground">{call.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Earnings Summary */}
            <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Weekly Earnings</h3>
                  <Coins className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-2">₹18,750</div>
                <div className="text-sm opacity-80">+25% from last week</div>
                <Button 
                  variant="secondary" 
                  className="w-full mt-4 bg-white text-teal-600 hover:bg-gray-100"
                >
                  Request Payout
                </Button>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-bold mb-2">Top Performer!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You're in the top 10% of hosts this week
                </p>
                <Badge className="bg-accent text-accent-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Elite Host
                </Badge>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calls received</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total time online</span>
                  <span className="font-semibold">4h 35m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average rating</span>
                  <span className="font-semibold flex items-center">
                    4.9 <Star className="w-3 h-3 ml-1 fill-current text-yellow-400" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
