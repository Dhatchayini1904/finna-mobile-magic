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
      variant="elevated" 
      className={cn(
        "p-5 opacity-0 animate-fade-up hover:border-primary/30 cursor-pointer group",
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              <span 
                className={cn(
                  "text-xs font-semibold px-1.5 py-0.5 rounded",
                  changeType === "positive" && "text-success bg-success/10",
                  changeType === "negative" && "text-destructive bg-destructive/10",
                  changeType === "neutral" && "text-muted-foreground bg-muted"
                )}
              >
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-secondary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10",
          iconColor
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
