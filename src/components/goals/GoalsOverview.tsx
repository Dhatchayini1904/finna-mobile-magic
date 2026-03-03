import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Wallet, TrendingUp, Calendar } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function GoalsOverview() {
  const { goals, loading } = useGoals();

  const statsData = useMemo(() => {
    if (loading || goals.length === 0) return null;

    const totalGoals = goals.length;
    const totalSaved = goals.reduce((acc, goal) => acc + Number(goal.current_amount), 0);
    const totalTarget = goals.reduce((acc, goal) => acc + Number(goal.target_amount), 0);

    // Simplistic monthly savings estimate based on time to deadline
    const monthlySavings = goals.reduce((acc, goal) => {
      if (!goal.deadline || goal.is_completed) return acc;
      const monthsLeft = Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const remainingAmount = Math.max(0, Number(goal.target_amount) - Number(goal.current_amount));
      return acc + (remainingAmount / monthsLeft);
    }, 0);

    const nextMilestoneGoal = [...goals]
      .filter(g => !g.is_completed && g.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())[0];

    return [
      {
        title: "Active Goals",
        value: totalGoals.toString(),
        icon: Target,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      {
        title: "Total Progress",
        value: `₹${totalSaved.toLocaleString('en-IN')}`,
        subtitle: `${((totalSaved / totalTarget) * 100).toFixed(1)}% of ₹${totalTarget.toLocaleString('en-IN')}`,
        icon: Wallet,
        color: "text-green-600",
        bg: "bg-green-500/10",
      },
      {
        title: "Req. Monthly",
        value: `₹${monthlySavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        subtitle: "Est. to hit deadlines",
        icon: TrendingUp,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        title: "Next Deadline",
        value: nextMilestoneGoal ? new Date(nextMilestoneGoal.deadline!).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "N/A",
        subtitle: nextMilestoneGoal ? nextMilestoneGoal.name : "All goals set!",
        icon: Calendar,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
      },
    ];
  }, [goals, loading]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const displayStats = statsData || [
    { title: "Active Goals", value: "0", icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Progress", value: "₹0", icon: Wallet, color: "text-green-600", bg: "bg-green-500/10" },
    { title: "Req. Monthly", value: "₹0", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
    { title: "Next Deadline", value: "N/A", icon: Calendar, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat) => (
        <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
