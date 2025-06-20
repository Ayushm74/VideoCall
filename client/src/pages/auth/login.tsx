import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [, setLocation] = useLocation();
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 10) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    login(phone, {
      onSuccess: () => {
        toast({
          title: 'Welcome! 🎉',
          description: 'You have been logged in successfully',
        });
        setLocation('/');
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-purple-700 to-secondary p-4">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <Card className="w-full max-w-md relative glass-card">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-accent to-yellow-400 bg-clip-text text-transparent mb-2">
            LiveChat
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-muted-foreground">
            Enter your phone number to continue
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-muted/50 border-border"
                disabled={isLoggingIn}
              />
            </div>

            <Button
              type="submit"
              className="w-full primary-gradient font-semibold text-lg py-6"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging In...' : 'Continue with OTP'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              New user? You'll get 100 welcome coins! 🎉
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
