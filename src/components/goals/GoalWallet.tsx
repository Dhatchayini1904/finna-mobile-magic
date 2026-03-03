import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet } from "lucide-react";

const goals = [
  { name: "Emergency Fund", current: 150000, target: 300000, color: "bg-red-500" },
  { name: "Europe Trip", current: 85000, target: 200000, color: "bg-blue-500" },
  { name: "New Car", current: 200000, target: 800000, color: "bg-purple-500" },
  { name: "Education", current: 50000, target: 500000, color: "bg-amber-500" },
];

export function GoalWallet() {
  const totalSaved = goals.reduce((acc, goal) => acc + goal.current, 0);
  const totalTarget = goals.reduce((acc, goal) => acc + goal.target, 0);
  const overallProgress = (totalSaved / totalTarget) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-card/50 to-purple-500/10 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Goal Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 rounded-xl bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
          <p className="text-3xl font-bold">₹{totalSaved.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">
            of ₹{totalTarget.toLocaleString()} target
          </p>
          <Progress value={overallProgress} className="h-2 mt-3" />
          <p className="text-sm text-primary mt-2">{overallProgress.toFixed(1)}% complete</p>
        </div>

        <div className="space-y-3">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${goal.color}`} />
                    <span>{goal.name}</span>
                  </div>
                  <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
