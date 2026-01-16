import { useRequests, useReports } from "@/hooks/use-requests";
import { useAuth } from "@/hooks/use-auth";
import { LayoutShell } from "@/components/layout-shell";
import { StatCard } from "@/components/stat-card";
import { FileText, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { data: requests } = useRequests();
  const { data: reports } = useReports();

  const myRequests = requests?.filter(r => r.userId === user?.id) || [];
  const myReports = reports?.filter(r => r.userId === user?.id) || [];

  const pendingRequests = myRequests.filter(r => r.status === "Pending").length;
  const readyRequests = myRequests.filter(r => r.status === "Ready").length;

  return (
    <LayoutShell>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl mb-2">Welcome back, {user?.fullName.split(' ')[0]}</h1>
        <p className="text-muted-foreground">Here's what's happening with your municipal services.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="New Request" 
          description="Request official documents"
          href="/dashboard/requests"
          icon={<FileText className="w-6 h-6" />}
          color="primary"
        />
        <StatCard 
          title="Report Issue" 
          description="Help fix city problems"
          href="/dashboard/report"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="accent"
        />
        <StatCard 
          title="Pending" 
          value={pendingRequests}
          description="Requests in progress"
          href="/dashboard/requests"
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatCard 
          title="Ready" 
          value={readyRequests}
          description="Documents ready"
          href="/dashboard/requests"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity Section */}
        <section className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">Recent Requests</h2>
            <a href="/dashboard/requests" className="text-sm text-primary font-medium hover:underline">View All</a>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.slice(0, 3).map((req, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={req.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{req.type}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(req.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium border
                    ${req.status === 'Ready' ? 'bg-success/10 text-success border-success/20' : 
                      req.status === 'Rejected' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                      'bg-warning/10 text-warning border-warning/20'}
                  `}>
                    {req.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* News / Announcements Stub */}
        <section className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">City Announcements</h2>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">New</span>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-white/20 pb-6">
                <h3 className="font-bold text-lg mb-2">New Digital Services Launched</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  We are proud to announce the launch of our new digital platform. You can now access 20+ municipal services online.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">City Cleanup Drive</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Join us this Saturday for a community cleanup event at the City Center Park.
                </p>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </section>
      </div>
    </LayoutShell>
  );
}
