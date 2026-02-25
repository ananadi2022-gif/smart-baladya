import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSwitcher } from "@/components/language-switcher";
import { 
  Building2, 
  FileText, 
  AlertTriangle, 
  LogOut, 
  User, 
  Menu,
  X,
  LayoutDashboard,
  Megaphone
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navItems = user?.role === "admin" 
    ? [
        { href: "/admin", label: t("admin.adminDashboard"), icon: LayoutDashboard },
      ]
    : [
        { href: "/dashboard", label: t("citizen.citizenDashboard"), icon: LayoutDashboard },
        { href: "/dashboard/requests", label: t("citizen.myRequests"), icon: FileText },
        { href: "/dashboard/report", label: t("citizen.newReport"), icon: AlertTriangle },
        { href: "/dashboard/announcements", label: "City Announcements", icon: Megaphone },
      ];

  const NavLink = ({ item, mobile = false }: { item: typeof navItems[0], mobile?: boolean }) => (
    <Link href={item.href} className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${isActive(item.href) 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-semibold" 
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }
      ${mobile ? "w-full text-lg" : ""}
    `}
    onClick={() => mobile && setIsMobileMenuOpen(false)}
    >
      <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight tracking-tight">Smart<br/>Baladiya</h1>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-4">
          <LanguageSwitcher />
          
          <div className="bg-secondary/50 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => logout.mutate()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t("common.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col flex-1">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg">Smart Baladiya</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-secondary text-foreground transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 top-16 bg-background z-40 p-4"
            >
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink key={item.href} item={item} mobile />
                ))}
                <div className="pt-8 border-t border-border mt-8">
                  <div className="flex items-center gap-3 mb-6 px-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{user?.fullName}</p>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => logout.mutate()}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-destructive/10 text-destructive font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 pb-20 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Desktop Main Content */}
      <main className="hidden md:block flex-1 p-8 overflow-y-auto h-screen bg-secondary/30">
        <div className="max-w-5xl mx-auto space-y-8 animate-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
