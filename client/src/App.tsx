import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import LandingPage from "@/pages/landing";
import AuthPage from "@/pages/auth";
import CitizenDashboard from "@/pages/dashboard/citizen-home";
import RequestsPage from "@/pages/dashboard/requests";
import ReportPage from "@/pages/dashboard/report";
import AnnouncementsPage from "@/pages/dashboard/announcements";
import AdminDashboard from "@/pages/admin/dashboard";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <NotFound />; // Or redirect to dashboard
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Citizen Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={CitizenDashboard} />
      </Route>
      <Route path="/dashboard/requests">
        <ProtectedRoute component={RequestsPage} />
      </Route>
      <Route path="/dashboard/report">
        <ProtectedRoute component={ReportPage} />
      </Route>
      <Route path="/dashboard/announcements">
        <ProtectedRoute component={AnnouncementsPage} />
      </Route>

      {/* Admin Route */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} adminOnly />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
