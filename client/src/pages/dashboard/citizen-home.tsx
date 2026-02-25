import { useRequests, useReports, useNews } from "@/hooks/use-requests";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LayoutShell } from "@/components/layout-shell";
import { StatCard } from "@/components/stat-card";
import { FileText, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: requests } = useRequests();
  const { data: reports } = useReports();
  const { data: news } = useNews();

  const myRequests = requests?.filter(r => r.userId === user?.id) || [];
  const myReports = reports?.filter(r => r.userId === user?.id) || [];
  const latestNews = news?.slice(0, 2) || [];

  const pendingRequests = myRequests.filter(r => r.status === "Pending").length;
  const readyRequests = myRequests.filter(r => r.status === "Ready").length;

  return (
    <LayoutShell>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">{t("citizen.welcomeCitizen")}, {user?.fullName.split(' ')[0]}</h1>
          <p className="text-muted-foreground">{t("citizen.hereWhats")}</p>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title={t("citizen.newRequest")} 
          description={t("citizen.requestDocuments")}
          href="/dashboard/requests"
          icon={<FileText className="w-6 h-6" />}
          color="primary"
        />
        <StatCard 
          title={t("citizen.newReport")} 
          description={t("citizen.helpFix")}
          href="/dashboard/report"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="accent"
        />
        <StatCard 
          title={t("citizen.pending")} 
          value={pendingRequests}
          description={t("citizen.requestsInProgress")}
          href="/dashboard/requests"
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatCard 
          title={t("citizen.ready")} 
          value={readyRequests}
          description={t("citizen.documentsReady")}
          href="/dashboard/requests"
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity Section */}
        <section className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">{t("citizen.recentRequests")}</h2>
            <a href="/dashboard/requests" className="text-sm text-primary font-medium hover:underline">{t("citizen.viewAll")}</a>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">{t("citizen.noRequests")}</p>
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

        {/* News / Announcements Section */}
        <section className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">{t("citizen.cityAnnouncements")}</h2>
              <Link href="/dashboard/announcements" className="text-white/80 hover:text-white text-xs font-medium underline">
                {t("citizen.viewAll")}
              </Link>
            </div>
            
            {latestNews.length === 0 ? (
              <p className="text-white/70 text-sm">{t("citizen.noNews") || "No announcements yet"}</p>
            ) : (
              <div className="space-y-6">
                {latestNews.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={idx < latestNews.length - 1 ? "border-b border-white/20 pb-6" : ""}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-40 rounded-lg object-cover mb-3"
                      />
                    )}
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </section>
      </div>
    </LayoutShell>
  );
}
