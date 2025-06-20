import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";


// Pages
import Login from "@/pages/auth/login";
import Home from "@/pages/viewer/home";
import Wallet from "@/pages/viewer/wallet";
import Profile from "@/pages/viewer/profile";
import HostDashboard from "@/pages/host/dashboard";
import HostEarnings from "@/pages/host/earnings";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Viewer app routes */}
      <Route path="/" component={Home} />
      
      <Route path="/wallet">
        <ProtectedRoute>
          <Wallet />
        </ProtectedRoute>
      </Route>
      
      <Route path="/calls">
        <ProtectedRoute>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Call History</h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/gifts">
        <ProtectedRoute>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Gift Collection</h2>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      
      {/* Host app routes */}
      <Route path="/host">
        <ProtectedRoute>
          <HostDashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/host/earnings">
        <ProtectedRoute>
          <HostEarnings />
        </ProtectedRoute>
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Toaster />
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
