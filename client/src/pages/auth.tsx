import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, user } = useAuth();
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
    
    if (isLogin) {
      login.mutate(data as any);
    } else {
      register.mutate(data as any);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
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
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Enter your credentials to access your dashboard" 
                : "Join the digital municipality platform today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-foreground">Full Name</label>
                  <input
                    name="fullName"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                    placeholder="e.g. Ahmed Benali"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">CIN (National ID)</label>
              <input
                name="cin"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none uppercase placeholder:normal-case"
                placeholder="e.g. AB123456"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Password</label>
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
              disabled={login.isPending || register.isPending}
              className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(login.isPending || register.isPending) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-border">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Create one" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Right: Decorative Image */}
      <div className="hidden lg:block relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 mix-blend-multiply z-10" />
        {/* Unsplash: Modern Morocco Architecture or generic modern building */}
        <img
          src="https://images.unsplash.com/photo-1558036117-15db527e9ea4?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Architecture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 p-12 text-white">
          <div className="max-w-lg">
            <h2 className="font-display font-bold text-5xl mb-6">Simpler. Faster. Smarter.</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Experience the new standard of public service. Smart Baladiya brings the municipality to your fingertips with a secure, efficient, and user-friendly platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
