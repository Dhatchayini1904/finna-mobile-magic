import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  delay = 0
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "p-5 opacity-0 animate-fade-up hover:border-primary/40 cursor-pointer group transition-all duration-300",
        "bg-card/40 backdrop-blur-md border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className={cn(
            "p-2.5 rounded-xl bg-secondary/50 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:rotate-[360deg] shadow-inner",
            iconColor
          )}>
            <Icon className="h-5 w-5" />
          </div>
          {change && (
            <span
              className={cn(
                "text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                changeType === "positive" && "text-green-600 bg-green-500/10 border border-green-500/20",
                changeType === "negative" && "text-red-600 bg-red-500/10 border border-red-500/20",
                changeType === "neutral" && "text-muted-foreground bg-muted border border-border/50"
              )}
            >
              {change}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest leading-none mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black font-display tracking-tighter text-foreground group-hover:text-primary transition-colors">{value}</p>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium opacity-60">vs last month</p>
        </div>
      </div>
    </Card>
  );
}
