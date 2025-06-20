import { Link, useLocation } from 'wouter';
import { Home, Wallet, Video, Gift, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: Video, label: 'Calls', path: '/calls' },
  { icon: Gift, label: 'Gifts', path: '/gifts' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location === path;
          
          return (
            <Link key={path} href={path}>
              <a className={cn(
                "flex flex-col items-center py-2 px-4 transition-colors",
                isActive 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground"
              )}>
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
                {label === 'Calls' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive-foreground">3</span>
                  </div>
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
