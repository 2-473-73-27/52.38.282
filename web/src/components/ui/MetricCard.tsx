import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  accent?: boolean;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  trendLabel,
  accent = false,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : null;
  return (
    <div
      className={cn(
        "group relative flex items-center justify-between overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md",
        accent
          ? "border-transparent bg-primary text-primary-foreground signal-glow"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            accent ? "bg-white/15" : "bg-accent/10 text-accent-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={cn("text-xs font-medium", accent ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {title}
          </p>
          <p className={cn("text-2xl font-bold tabular-nums", accent ? "text-white" : "text-foreground")}>
            {value}
          </p>
        </div>
      </div>
      {TrendIcon && (
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
            trend === "up"
              ? accent ? "bg-white/15 text-white" : "bg-accent/10 text-accent-foreground"
              : "bg-destructive/10 text-destructive",
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {trendLabel}
        </div>
      )}
    </div>
  );
      }
