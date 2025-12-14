import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const data = [
  { month: "Jan", value: 1000000, benchmark: 1000000 },
  { month: "Feb", value: 1025000, benchmark: 1015000 },
  { month: "Mar", value: 1080000, benchmark: 1035000 },
  { month: "Apr", value: 1050000, benchmark: 1045000 },
  { month: "May", value: 1120000, benchmark: 1060000 },
  { month: "Jun", value: 1150000, benchmark: 1080000 },
  { month: "Jul", value: 1180000, benchmark: 1095000 },
  { month: "Aug", value: 1220000, benchmark: 1110000 },
  { month: "Sep", value: 1195000, benchmark: 1125000 },
  { month: "Oct", value: 1280000, benchmark: 1140000 },
  { month: "Nov", value: 1320000, benchmark: 1160000 },
  { month: "Dec", value: 1245890, benchmark: 1180000 },
];

const periods = ["1W", "1M", "3M", "6M", "1Y", "All"];

export function PerformanceChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Performance</CardTitle>
        <div className="flex gap-1">
          {periods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" />
              <XAxis
                dataKey="month"
                stroke="hsl(215, 20%, 45%)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(215, 20%, 45%)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(224, 50%, 10%)",
                  border: "1px solid hsl(215, 20%, 20%)",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
                name="Portfolio"
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="hsl(215, 20%, 45%)"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="Benchmark"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded bg-primary" />
            <span className="text-muted-foreground">Portfolio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 rounded bg-muted-foreground border-dashed" />
            <span className="text-muted-foreground">Benchmark (Nifty 50)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
