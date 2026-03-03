import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal, Plus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  icon: string;
  monthlyContribution?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddMoney?: () => void;
}

const categoryColors: Record<string, string> = {
  travel: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  emergency: "bg-red-500/20 text-red-400 border-red-500/30",
  home: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  education: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  retirement: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  vehicle: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export function GoalCard({
  name,
  target,
  current,
  deadline,
  category,
  icon,
  monthlyContribution = 0,
  onEdit,
  onDelete,
  onAddMoney,
}: GoalCardProps) {
  const progress = (current / target) * 100;
  const remaining = target - current;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
              {icon}
            </div>
            <div>
              <h4 className="font-semibold">{name}</h4>
              <Badge variant="outline" className={categoryColors[category] || categoryColors.travel}>
                {category}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ₹{current.toLocaleString()} saved
            </span>
            <span className="font-medium">₹{target.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className="font-semibold">₹{remaining.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deadline</p>
            <p className="font-semibold">{deadline}</p>
          </div>
        </div>

        {monthlyContribution > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-primary">
            <TrendingUp className="h-4 w-4" />
            <span>₹{monthlyContribution.toLocaleString()}/month auto-save</span>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button className="flex-1" size="sm" onClick={onAddMoney}>
            <Plus className="h-4 w-4 mr-1" />
            Add Money
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
