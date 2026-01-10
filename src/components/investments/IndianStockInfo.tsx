import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Search, Star, Info, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample Indian stocks for educational purposes
const indianStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2847.50, change: 1.2 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", price: 4125.75, change: -0.5 },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1678.30, change: 0.8 },
  { symbol: "INFY", name: "Infosys", sector: "IT", price: 1823.45, change: 2.1 },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1245.60, change: 1.5 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", price: 2456.80, change: -0.3 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1567.25, change: 0.9 },
  { symbol: "ITC", name: "ITC Limited", sector: "FMCG", price: 478.90, change: 1.8 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1834.55, change: -0.7 },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3456.70, change: 2.4 },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", price: 1123.45, change: 1.1 },
  { symbol: "WIPRO", name: "Wipro", sector: "IT", price: 456.30, change: -1.2 },
];

const sectorColors: Record<string, string> = {
  Energy: "bg-amber-500/10 text-amber-500",
  IT: "bg-info/10 text-info",
  Banking: "bg-success/10 text-success",
  FMCG: "bg-primary/10 text-primary",
  Telecom: "bg-purple-500/10 text-purple-500",
  Infrastructure: "bg-warning/10 text-warning",
};

export function IndianStockInfo() {
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>(["RELIANCE", "TCS", "HDFCBANK"]);

  const filteredStocks = indianStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase()) ||
      stock.sector.toLowerCase().includes(search.toLowerCase())
  );

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-success/10">
              <Building2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg">Indian Stocks</CardTitle>
              <CardDescription>NSE/BSE listed companies</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Info className="h-3 w-3" />
            Educational
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks by name, symbol, or sector..."
            className="pl-9"
          />
        </div>

        {/* Stock List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-3 rounded-xl border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleWatchlist(stock.symbol)}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      watchlist.includes(stock.symbol)
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground"
                    )}
                  />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{stock.symbol}</span>
                    <Badge
                      variant="secondary"
                      className={cn("text-[10px] px-1.5 py-0", sectorColors[stock.sector])}
                    >
                      {stock.sector}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{stock.price.toLocaleString('en-IN')}</p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    stock.change >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Educational Note */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-warning/5 to-destructive/5 border border-warning/10">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-warning" />
            Important Disclaimer
          </h4>
          <p className="text-xs text-muted-foreground">
            This is for educational purposes only. Stock prices are simulated and may not reflect
            actual market values. Please consult a SEBI-registered investment advisor before
            investing in stocks. Equity investments are subject to market risks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
