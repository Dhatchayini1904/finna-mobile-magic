import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, MoreHorizontal, Calendar, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

interface BillCardProps {
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  logo?: string;
  isRecurring?: boolean;
  isPaid?: boolean;
  isOverdue?: boolean;
  reminderSet?: boolean;
}

const categoryColors: Record<string, string> = {
  streaming: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  utilities: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  insurance: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  subscription: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  rent: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  loan: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function BillCard({
  name,
  amount,
  dueDate,
  category,
  logo,
  isRecurring = true,
  isPaid = false,
  isOverdue = false,
  reminderSet = true,
}: BillCardProps) {
  return (
    <Card
      className={cn(
        "bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors",
        isPaid && "opacity-60",
        isOverdue && "border-red-500/50"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              {logo || name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{name}</h4>
                {isRecurring && <Repeat className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={categoryColors[category] || categoryColors.subscription}>
                  {category}
                </Badge>
                {isPaid && (
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Paid
                  </Badge>
                )}
                {isOverdue && (
                  <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Overdue
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">₹{amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
              <Calendar className="h-3 w-3" />
              {dueDate}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2",
              reminderSet ? "text-primary" : "text-muted-foreground"
            )}
          >
            {reminderSet ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            {reminderSet ? "Reminder On" : "Set Reminder"}
          </Button>
          <div className="flex gap-1">
            {!isPaid && (
              <Button size="sm" variant="default">
                Pay Now
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
