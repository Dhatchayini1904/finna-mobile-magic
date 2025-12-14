import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const stats = [
  {
    title: "Total Due",
    value: "₹24,500",
    subtitle: "This month",
    icon: Receipt,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  {
    title: "Upcoming",
    value: "5",
    subtitle: "Next 7 days",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
  },
  {
    title: "Overdue",
    value: "1",
    subtitle: "₹2,999",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/20",
  },
  {
    title: "Paid",
    value: "8",
    subtitle: "₹45,600",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/20",
  },
];

export function BillsSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
