import { useLocation } from 'wouter';
import { BottomNavigation } from '@/components/bottom-navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  
  const showBottomNav = !location.startsWith('/admin') && !location.startsWith('/host');

  return (
    <div className="min-h-screen bg-background">
      <main className={showBottomNav ? 'pb-20' : ''}>
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
