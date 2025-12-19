import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Target } from "lucide-react";
import { useStockData } from "@/hooks/useStockData";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface HoldingAnalysis {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  investedValue: number;
  profitLoss: number;
  profitLossPercent: number;
  portfolioWeight: number;
}

const staticHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", quantity: 25, avgPrice: 165, type: "stock" },
  { symbol: "GOOGL", name: "Alphabet Inc.", quantity: 10, avgPrice: 135, type: "stock" },
  { symbol: "MSFT", name: "Microsoft Corporation", quantity: 15, avgPrice: 340, type: "stock" },
  { symbol: "NVDA", name: "NVIDIA Corporation", quantity: 8, avgPrice: 450, type: "stock" },
  { symbol: "AMZN", name: "Amazon.com Inc.", quantity: 12, avgPrice: 155, type: "stock" },
];

export function PortfolioAnalytics() {
  const { getBatchQuotes, loading } = useStockData();
  const [analytics, setAnalytics] = useState<HoldingAnalysis[]>([]);
  const [totals, setTotals] = useState({
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
    winners: 0,
    losers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const symbols = staticHoldings.map(h => h.symbol);
      const quotes = await getBatchQuotes(symbols);

      let totalValue = 0;
      let totalInvested = 0;

      const analysisData = staticHoldings.map((holding) => {
        const quote = quotes.find(q => q.symbol === holding.symbol);
        const currentPrice = quote?.price || holding.avgPrice * 1.1;
        const value = currentPrice * holding.quantity;
        const investedValue = holding.avgPrice * holding.quantity;
        const profitLoss = value - investedValue;
        const profitLossPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

        totalValue += value;
        totalInvested += investedValue;

        return {
          symbol: holding.symbol,
          name: holding.name,
          quantity: holding.quantity,
          avgPrice: holding.avgPrice,
          currentPrice,
          value,
          investedValue,
          profitLoss,
          profitLossPercent,
          portfolioWeight: 0,
        };
      });

      // Calculate portfolio weights
      const finalAnalysis = analysisData.map(a => ({
        ...a,
        portfolioWeight: (a.value / totalValue) * 100,
      }));

      const winners = finalAnalysis.filter(a => a.profitLoss > 0).length;
      const losers = finalAnalysis.filter(a => a.profitLoss < 0).length;

      setAnalytics(finalAnalysis);
      setTotals({
        totalValue,
        totalInvested,
        totalProfitLoss: totalValue - totalInvested,
        totalProfitLossPercent: ((totalValue - totalInvested) / totalInvested) * 100,
        winners,
        losers,
      });
    };

    fetchData();
  }, [getBatchQuotes]);

  const chartData = analytics.map(a => ({
    symbol: a.symbol,
    profitLoss: a.profitLoss,
    color: a.profitLoss >= 0 ? 'hsl(160, 84%, 39%)' : 'hsl(0, 84%, 60%)',
  })).sort((a, b) => b.profitLoss - a.profitLoss);

  if (loading && analytics.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Portfolio Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-background/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <DollarSign className="h-4 w-4" />
              Total Value
            </div>
            <p className="text-xl font-bold">
              ${totals.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-background/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Target className="h-4 w-4" />
              Total Invested
            </div>
            <p className="text-xl font-bold">
              ${totals.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-background/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              {totals.totalProfitLoss >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              Total P/L
            </div>
            <p className={`text-xl font-bold ${totals.totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totals.totalProfitLoss >= 0 ? '+' : ''}${totals.totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className={`text-sm ${totals.totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ({totals.totalProfitLossPercent >= 0 ? '+' : ''}{totals.totalProfitLossPercent.toFixed(2)}%)
            </p>
          </div>
          <div className="p-4 rounded-xl bg-background/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <PieChart className="h-4 w-4" />
              Win/Loss
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {totals.winners} Winners
              </Badge>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {totals.losers} Losers
              </Badge>
            </div>
          </div>
        </div>

        {/* P/L Chart */}
        <div>
          <h3 className="text-sm font-medium mb-3">Profit/Loss by Holding</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" />
                <XAxis 
                  type="number" 
                  stroke="hsl(215, 20%, 45%)"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  dataKey="symbol" 
                  type="category" 
                  stroke="hsl(215, 20%, 45%)"
                  fontSize={12}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(224, 50%, 10%)",
                    border: "1px solid hsl(215, 20%, 20%)",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'P/L']}
                />
                <Bar dataKey="profitLoss" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Holdings Table */}
        <div>
          <h3 className="text-sm font-medium mb-3">Detailed P/L by Position</h3>
          <div className="space-y-2">
            {analytics.sort((a, b) => b.profitLoss - a.profitLoss).map((holding) => (
              <div
                key={holding.symbol}
                className="p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{holding.symbol}</span>
                    <span className="text-sm text-muted-foreground">{holding.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${holding.profitLoss >= 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
                  >
                    {holding.profitLoss >= 0 ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Invested</p>
                    <p className="font-medium">${holding.investedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Current Value</p>
                    <p className="font-medium">${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">P/L</p>
                    <p className={`font-medium ${holding.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Portfolio %</p>
                    <div className="flex items-center gap-2">
                      <Progress value={holding.portfolioWeight} className="h-1.5 flex-1" />
                      <span className="font-medium text-xs">{holding.portfolioWeight.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}