import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw, Activity, LineChart, Hash, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockData, StockQuote } from "@/hooks/useStockData";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Using standard NSE tokens for Google Finance active queries
const MARKET_INDEX_SYMBOLS = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "SBIN"];

interface MarketQuote extends StockQuote {
    name?: string;
}

export function LiveMarketTracker() {
    const { getBatchQuotes, loading } = useStockData();
    const [quotes, setQuotes] = useState<MarketQuote[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchStockData = async () => {
        setIsRefreshing(true);
        const liveQuotes = await getBatchQuotes(MARKET_INDEX_SYMBOLS);

        if (liveQuotes && liveQuotes.length > 0) {
            // Map names over the fetched symbols for visual clarity 
            const nameMap: Record<string, string> = {
                "RELIANCE": "Reliance Ind",
                "TCS": "Tata Consultancy",
                "HDFCBANK": "HDFC Bank",
                "INFY": "Infosys Ltd",
                "SBIN": "State Bank of India"
            };

            const mappedQuotes: MarketQuote[] = liveQuotes.map(q => ({
                ...q,
                name: nameMap[q.symbol] || q.symbol
            }));

            // Sort by highest Volume as primary market indicator
            setQuotes(mappedQuotes.sort((a, b) => b.volume - a.volume));
            setLastUpdated(new Date());
        }
        setIsRefreshing(false);
    };

    useEffect(() => {
        fetchStockData();
        const interval = setInterval(fetchStockData, 15000); // 15 second ultra-fast market polling
        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        Live Market Value View
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        <Activity className="h-3 w-3 text-primary animate-pulse" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            Live Quote Stream
                        </span>
                        {lastUpdated && (
                            <span className="text-xs text-muted-foreground">
                                • Synced {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchStockData}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Force Sync
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/40">
                        <div className="col-span-4">Asset</div>
                        <div className="col-span-2 text-right">LTP (₹)</div>
                        <div className="col-span-2 text-right">% Chg</div>
                        <div className="col-span-2 text-right">Range (H/L)</div>
                        <div className="col-span-2 text-right">Volume</div>
                    </div>

                    {loading || quotes.length === 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                        ))
                    ) : (
                        quotes.map((quote) => (
                            <div
                                key={quote.symbol}
                                className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl bg-background/50 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50"
                            >
                                {/* Asset Identity */}
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="text-xs font-bold text-primary">
                                            {quote.name ? quote.name.substring(0, 2).toUpperCase() : quote.symbol.substring(0, 2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm block">{quote.name}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{quote.symbol}.NSE</span>
                                    </div>
                                </div>

                                {/* LTP */}
                                <div className="col-span-2 text-right">
                                    <span className="font-semibold text-[15px]">
                                        ₹{quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                {/* Day Change */}
                                <div className="col-span-2 flex justify-end">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs px-2 py-1 ${quote.change >= 0 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
                                    >
                                        {quote.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                        {quote.changePercent > 0 ? "+" : ""}{quote.changePercent.toFixed(2)}%
                                    </Badge>
                                </div>

                                {/* Range (High/Low) */}
                                <div className="col-span-2 flex flex-col items-end justify-center">
                                    <div className="flex items-center gap-1 text-[11px] font-medium text-blue-600">
                                        <TrendingUp className="h-3 w-3" /> H: ₹{quote.high.toLocaleString('en-IN')}
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] font-medium text-orange-600/80">
                                        <TrendingDown className="h-3 w-3" /> L: ₹{quote.low.toLocaleString('en-IN')}
                                    </div>
                                </div>

                                {/* Volume Activity */}
                                <div className="col-span-2 text-right flex flex-col items-end">
                                    <span className="text-xs font-medium bg-secondary/80 px-2 py-1 rounded-md flex items-center gap-1 border border-border/50">
                                        <Hash className="h-3 w-3 opacity-70" />
                                        {(quote.volume / 1000000).toFixed(2)}M
                                    </span>
                                    <span className="text-[10px] text-muted-foreground mt-1">Traded Shares</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
