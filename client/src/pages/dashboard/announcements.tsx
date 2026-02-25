import { useNews } from "@/hooks/use-requests";
import { useTranslation } from "@/hooks/use-translation";
import { LayoutShell } from "@/components/layout-shell";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Loader2, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const { data: news, isLoading } = useNews();

  return (
    <LayoutShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">{t("announcements.cityAnnouncements") || "City Announcements"}</h1>
          <p className="text-muted-foreground">{t("announcements.stayUpdated") || "Stay updated with the latest news from your city"}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : news && news.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border/60">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-xl mb-2">{t("announcements.noNews") || "No announcements yet"}</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {t("announcements.checkBack") || "Check back soon for the latest updates from your city"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {news?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-border/50 hover:border-primary/30 transition-all overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                {item.imageUrl && (
                  <div className="md:w-64 flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 md:h-56 rounded-xl object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-display font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                    {item.content}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.publishedAt), "PPP p")}
                  </p>
                  {item.updatedAt && item.updatedAt !== item.publishedAt && (
                    <p className="text-xs text-muted-foreground">
                      Updated: {format(new Date(item.updatedAt), "PPP p")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </LayoutShell>
  );
}
