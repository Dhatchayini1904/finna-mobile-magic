import { Plus, Send, QrCode, ArrowLeftRight, Receipt, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Plus, label: "Add Money", color: "text-success" },
  { icon: Send, label: "Transfer", color: "text-info" },
  { icon: QrCode, label: "Scan & Pay", color: "text-primary" },
  { icon: Receipt, label: "Pay Bills", color: "text-warning" },
  { icon: Target, label: "Goals", color: "text-primary" },
  { icon: ArrowLeftRight, label: "Exchange", color: "text-info" },
];

export function QuickActions() {
  return (
    <Card 
      variant="elevated" 
      className="opacity-0 animate-fade-up stagger-1"
      style={{ animationFillMode: 'forwards' }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.label}
              variant="ghost"
              className={cn(
                "h-auto flex-col gap-2 py-4 hover:bg-secondary group"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl bg-secondary transition-all duration-300",
                "group-hover:scale-110 group-hover:bg-primary/10",
                action.color
              )}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
