import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useInvestments } from "@/hooks/useInvestments";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ASSET_COLORS: Record<string, string> = {
  "stock": "hsl(221, 83%, 53%)", // Primary Blue
  "mutual_fund": "hsl(217, 91%, 60%)",
  "crypto": "hsl(250, 80%, 60%)",
  "gold": "hsl(45, 90%, 55%)",
  "fd": "hsl(199, 89%, 48%)",
  "other": "hsl(215, 16%, 47%)"
};

const ASSET_LABELS: Record<string, string> = {
  "stock": "Stocks",
  "mutual_fund": "Mutual Funds",
  "crypto": "Crypto",
  "gold": "Gold",
  "fd": "Fixed Deposits (FD)",
  "other": "Other"
};

export function AllocationChart() {
  const { investments, loading } = useInvestments();

  const data = useMemo(() => {
    let totalValue = 0;
    const typeMap = new Map<string, number>();

    investments.forEach((inv) => {
      totalValue += inv.currentValue;
      const t = inv.type || "other";
      typeMap.set(t, (typeMap.get(t) || 0) + inv.currentValue);
    });

    if (totalValue === 0) return [];

    return Array.from(typeMap.entries()).map(([type, value]) => ({
      name: ASSET_LABELS[type] || type,
      value: Number(((value / totalValue) * 100).toFixed(1)),
      color: ASSET_COLORS[type] || ASSET_COLORS["other"],
      raw_value: value
    })).sort((a, b) => b.value - a.value);
  }, [investments]);

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center">
            <Skeleton className="w-[150px] h-[150px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground text-sm">
            <PieChart className="w-12 h-12 mb-2 opacity-20" />
            <p>No allocation data available</p>
            <p className="text-xs">Add investments to see your asset distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => [`${value}%`, "Allocation"]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-muted-foreground text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-muted-foreground">₹{item.raw_value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                <span className="font-medium min-w-[3ch] text-right">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
