import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavCardProps {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  accent?: boolean;
}

/** Dashboard quick-nav card. */
export function NavCard({ to, label, icon: Icon, description, accent = false }: NavCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg",
        accent
          ? "border-transparent bg-primary text-primary-foreground signal-glow"
          : "border-border bg-card hover:border-accent/40",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
          accent ? "bg-white/15" : "bg-accent/10 text-accent-foreground",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className={cn("font-semibold", accent ? "text-white" : "text-foreground")}>{label}</p>
        {description && (
          <p className={cn("mt-0.5 text-xs", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
