import { MessageSquareText } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
  variant?: "light" | "dark";
}

/** App logo — uses uploaded image if available, otherwise a stylized text logo. */
export function Logo({ className, showText = true, textClassName, variant = "light" }: LogoProps) {
  const { logoUrl } = useAuth();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {logoUrl ? (
        <img src={logoUrl} alt="Grat SMS" className={cn("h-8 w-8 rounded-lg object-cover", className)} />
      ) : (
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", variant === "light" ? "bg-accent text-accent-foreground" : "bg-white/15 text-white")}>
          <MessageSquareText className="h-5 w-5" />
        </div>
      )}
      {showText && (
        <span className={cn("text-lg font-bold tracking-tight", textClassName)}>
          Grat<span className="text-accent"> SMS</span>
        </span>
      )}
    </div>
  );
}
