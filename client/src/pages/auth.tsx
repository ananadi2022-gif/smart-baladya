import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation } from "wouter";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AuthPage() {
  const { login, user } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation(user.role === "admin" ? "/admin" : "/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    
    login.mutate(data as any);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-40">
        <LanguageSwitcher />
      </div>

      {/* Left: Form Section */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Smart Baladiya</span>
            </div>
            <h1 className="font-display font-bold text-4xl mb-2 text-foreground">
              {t("auth.welcomeBack")}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t("auth.enterCredentials")}
            </p>
            <div className="bg-secondary/50 border border-primary/20 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-2">{t("auth.demoCredentials")}</p>
              <p>👤 {t("auth.client")}: <span className="font-mono">client</span> / <span className="font-mono">client</span></p>
              <p>👨‍💼 {t("auth.admin")}: <span className="font-mono">admin</span> / <span className="font-mono">admin</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">{t("auth.username")}</label>
              <input
                name="cin"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                placeholder="e.g. client or admin"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">{t("auth.password")}</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {login.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t("auth.signIn")} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right: Decorative Image */}
      <div className="hidden lg:block relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 mix-blend-multiply z-10" />
        {/* Unsplash: Modern Morocco Architecture or generic modern building */}
        <img
          src="/auth-bg.png"
          alt="Modern Architecture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 p-12 text-white">
          <div className="max-w-lg">
            <h2 className="font-display font-bold text-5xl mb-6">{t("auth.welcomeMessage")}</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              {t("auth.welcomeDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
