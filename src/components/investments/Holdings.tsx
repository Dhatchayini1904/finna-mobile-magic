import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, MoreHorizontal, RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockData, StockQuote } from "@/hooks/useStockData";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  change: number;
  type: string;
  profitLoss: number;
  profitLossPercent: number;
}

const staticHoldings = [
  { symbol: "RI", name: "Reliance Industries", quantity: 15, avgPrice: 2800, type: "stock" },
  { symbol: "TCS", name: "Tata Consultancy Services", quantity: 5, avgPrice: 3900, type: "stock" },
  { symbol: "HDF01", name: "HDFC Bank", quantity: 20, avgPrice: 1600, type: "stock" },
  { symbol: "IT", name: "Infosys Ltd", quantity: 10, avgPrice: 1500, type: "stock" },
  { symbol: "SBI", name: "State Bank of India", quantity: 30, avgPrice: 800, type: "stock" },
];

const typeColors: Record<string, string> = {
  stock: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  crypto: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  etf: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  mutual_fund: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

export function Holdings() {
  const { getBatchQuotes, loading } = useStockData();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(30);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStockData = async () => {
    setIsRefreshing(true);
    const symbols = staticHoldings.map(h => h.symbol);
    const quotes = await getBatchQuotes(symbols);

    if (quotes.length > 0) {
      const updatedHoldings = staticHoldings.map((holding) => {
        const quote = quotes.find(q => q.symbol === holding.symbol);
        const currentPrice = quote?.price || holding.avgPrice * 1.1;
        const change = quote?.changePercent || ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
        const profitLoss = (currentPrice - holding.avgPrice) * holding.quantity;
        const profitLossPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

        return {
          ...holding,
          currentPrice,
          value: currentPrice * holding.quantity,
          change,
          profitLoss,
          profitLossPercent,
        };
      });
      setHoldings(updatedHoldings);
    } else {
      const fallbackHoldings = staticHoldings.map((holding) => {
        const randomMultiplier = 1 + (Math.random() * 0.2 - 0.1);
        const currentPrice = holding.avgPrice * randomMultiplier;
        const profitLoss = (currentPrice - holding.avgPrice) * holding.quantity;
        const profitLossPercent = ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
        return {
          ...holding,
          currentPrice,
          value: currentPrice * holding.quantity,
          change: profitLossPercent,
          profitLoss,
          profitLossPercent,
        };
      });
      setHoldings(fallbackHoldings);
    }
    setIsRefreshing(false);
    setLastUpdated(new Date());
    setTimeUntilRefresh(30);
  };

  useEffect(() => {
    fetchStockData();

    if (autoRefreshEnabled) {
      intervalRef.current = setInterval(fetchStockData, AUTO_REFRESH_INTERVAL);
      countdownRef.current = setInterval(() => {
        setTimeUntilRefresh(prev => (prev > 0 ? prev - 1 : 30));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autoRefreshEnabled]);

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(prev => !prev);
    if (autoRefreshEnabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Holdings</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Activity className={`h-3 w-3 ${autoRefreshEnabled ? 'text-emerald-400 animate-pulse' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">
              {autoRefreshEnabled ? `Auto-refresh in ${timeUntilRefresh}s` : 'Auto-refresh disabled'}
            </span>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefreshEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoRefresh}
            className="text-xs"
          >
            {autoRefreshEnabled ? 'Live' : 'Paused'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStockData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {autoRefreshEnabled && (
          <Progress value={(30 - timeUntilRefresh) / 30 * 100} className="h-1 mb-4" />
        )}
        <div className="space-y-3">
          {loading && holdings.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : (
            holdings.map((holding) => (
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
                    <p className="text-xs text-muted-foreground">
                      {holding.quantity} shares @ ₹{holding.currentPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{holding.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm ${holding.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                    {holding.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{holding.change >= 0 ? "+" : ""}{holding.change.toFixed(2)}%</span>
                  </div>
                  <p className={`text-xs ${holding.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {holding.profitLoss >= 0 ? '+' : ''}₹{holding.profitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { staticHoldings };
