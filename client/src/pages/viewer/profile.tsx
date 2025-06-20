import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Edit, 
  Crown, 
  Coins, 
  Phone, 
  Star, 
  Gift, 
  Settings,
  LogOut,
  Heart 
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  const handleSaveProfile = () => {
    // TODO: Implement profile update API
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  const stats = [
    { icon: Coins, label: 'Total Coins Spent', value: '2,450', color: 'text-accent' },
    { icon: Phone, label: 'Video Calls', value: '28', color: 'text-blue-400' },
    { icon: Gift, label: 'Gifts Sent', value: '15', color: 'text-purple-400' },
    { icon: Heart, label: 'Favorites', value: '8', color: 'text-red-400' },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Please Login</h2>
            <p className="text-muted-foreground">
              You need to be logged in to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-accent">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-2xl font-bold">
                    {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {currentUser.isVip && (
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground p-1 rounded-full">
                    <Crown className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={currentUser.username || 'Enter username'}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} size="sm">
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-2xl font-bold">
                        {currentUser.username || 'Anonymous User'}
                      </h2>
                      {currentUser.isVip && (
                        <Badge className="bg-accent text-accent-foreground">
                          <Crown className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{currentUser.phone}</p>
                    
                    {/* Coin Balance */}
                    <div className="flex items-center justify-center md:justify-start gap-2 gold-gradient px-4 py-2 rounded-full w-fit">
                      <Coins className="w-5 h-5 text-accent-foreground" />
                      <span className="text-accent-foreground font-bold">
                        {currentUser.coinBalance || 0} coins
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* VIP Upgrade */}
        {!currentUser.isVip && (
          <Card className="mb-8 border-accent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Upgrade to VIP</h3>
                    <p className="text-muted-foreground">
                      Get exclusive features and priority support
                    </p>
                  </div>
                </div>
                <Button className="gold-gradient text-accent-foreground">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span>Notifications</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Privacy Settings</span>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Payment Methods</span>
              <Button variant="outline" size="sm">Update</Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Help & Support</span>
              <Button variant="outline" size="sm">Contact</Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-6">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
