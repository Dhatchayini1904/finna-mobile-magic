import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Food & Dining", value: 8500, color: "hsl(142, 71%, 45%)" },
  { name: "Transport", value: 4200, color: "hsl(199, 89%, 48%)" },
  { name: "Entertainment", value: 3100, color: "hsl(280, 67%, 60%)" },
  { name: "Shopping", value: 5800, color: "hsl(38, 92%, 50%)" },
  { name: "Bills & Utilities", value: 6200, color: "hsl(0, 72%, 51%)" },
  { name: "Others", value: 2400, color: "hsl(220, 14%, 50%)" },
];

const total = data.reduce((sum, item) => sum + item.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const percentage = ((item.value / total) * 100).toFixed(1);
    return (
      <div className="glass rounded-lg p-3 shadow-elevated">
        <p className="text-sm font-semibold" style={{ color: item.color }}>{item.name}</p>
        <p className="text-xs text-muted-foreground">
          ₹{item.value.toLocaleString('en-IN')} ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingCategories() {
  return (
    <Card 
      variant="elevated" 
      className="opacity-0 animate-fade-up stagger-4"
      style={{ animationFillMode: 'forwards' }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="h-[200px] w-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold font-display">₹{(total / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 w-full">
            {data.map((item) => {
              const percentage = ((item.value / total) * 100).toFixed(0);
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
