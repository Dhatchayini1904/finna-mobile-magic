import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const holdings = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    quantity: 50,
    avgPrice: 2450,
    currentPrice: 2890,
    value: 144500,
    change: 17.96,
    type: "stock",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    quantity: 30,
    avgPrice: 3200,
    currentPrice: 3650,
    value: 109500,
    change: 14.06,
    type: "stock",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    quantity: 80,
    avgPrice: 1580,
    currentPrice: 1720,
    value: 137600,
    change: 8.86,
    type: "stock",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    quantity: 0.15,
    avgPrice: 3500000,
    currentPrice: 4200000,
    value: 630000,
    change: 20.0,
    type: "crypto",
  },
  {
    symbol: "NIFTY50 ETF",
    name: "Nippon India Nifty 50",
    quantity: 200,
    avgPrice: 215,
    currentPrice: 242,
    value: 48400,
    change: 12.56,
    type: "etf",
  },
  {
    symbol: "PPFAS",
    name: "Parag Parikh Flexi Cap",
    quantity: 1500,
    avgPrice: 52,
    currentPrice: 68,
    value: 102000,
    change: 30.77,
    type: "mutual_fund",
  },
];

const typeColors: Record<string, string> = {
  stock: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  crypto: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  etf: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  mutual_fund: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export function Holdings() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Holdings</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {holdings.map((holding) => (
            <div
              key={holding.symbol}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {holding.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{holding.symbol}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${typeColors[holding.type]}`}
                    >
                      {holding.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{holding.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{holding.value.toLocaleString()}</p>
                <div className={`flex items-center justify-end gap-1 text-sm ${
                  holding.change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}>
                  {holding.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{holding.change >= 0 ? "+" : ""}{holding.change.toFixed(2)}%</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
