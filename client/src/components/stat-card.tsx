import { ReactNode } from "react";
import { Link } from "wouter";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: ReactNode;
  href: string;
  description: string;
  color?: "primary" | "accent" | "success" | "warning";
}

export function StatCard({ title, value, icon, href, description, color = "primary" }: StatCardProps) {
  const colorMap = {
    primary: "from-primary/10 to-primary/5 text-primary border-primary/20 hover:border-primary/50",
    accent: "from-accent/10 to-accent/5 text-accent border-accent/20 hover:border-accent/50",
    success: "from-success/10 to-success/5 text-success border-success/20 hover:border-success/50",
    warning: "from-warning/10 to-warning/5 text-warning border-warning/20 hover:border-warning/50",
  };

  return (
    <Link href={href} className={`
      relative overflow-hidden group p-6 rounded-2xl border transition-all duration-300
      bg-gradient-to-br hover:-translate-y-1 hover:shadow-xl
      ${colorMap[color]}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {value && (
          <span className="text-3xl font-display font-bold tracking-tight">
            {value}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {/* Decorative circle */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
    </Link>
  );
}
