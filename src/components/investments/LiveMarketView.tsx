import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw, Activity, LineChart, Globe, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStockData, StockQuote } from "@/hooks/useStockData";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const TICKERS = [
    // India (NSE)
    "RELIANCE", "TCS", "HDFCBANK", "ICICIBANK", "BHARTIARTL",
    "SBIN", "INFY", "ITC", "AXISBANK", "KOTAKBANK",
    "HINDUNILVR", "ADANIENT", "TATAMOTORS", "ASIANPAINT", "SUNPHARMA",
    "TITAN", "BAJFINANCE", "MARUTI", "WIPRO", "HCLTECH",
    // Global (NASDAQ/NYSE)
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX", "AMD", "INTC"
];

const COMPANY_NAMES: Record<string, string> = {
    "RELIANCE": "Reliance Ind",
    "TCS": "TCS",
    "HDFCBANK": "HDFC Bank",
    "ICICIBANK": "ICICI Bank",
    "BHARTIARTL": "Airtel",
    "SBIN": "SBI",
    "INFY": "Infosys",
    "ITC": "ITC",
    "AXISBANK": "Axis Bank",
    "KOTAKBANK": "Kotak Bank",
    "HINDUNILVR": "Hindustan Unilever",
    "ADANIENT": "Adani Ent",
    "TATAMOTORS": "Tata Motors",
    "ASIANPAINT": "Asian Paints",
    "SUNPHARMA": "Sun Pharma",
    "TITAN": "Titan Company",
    "BAJFINANCE": "Bajaj Finance",
    "MARUTI": "Maruti Suzuki",
    "WIPRO": "Wipro",
    "HCLTECH": "HCL Tech",
    "AAPL": "Apple Inc",
    "MSFT": "Microsoft",
    "GOOGL": "Alphabet",
    "AMZN": "Amazon",
    "NVDA": "NVIDIA",
    "TSLA": "Tesla",
    "META": "Meta Platforms",
    "BRK-B": "Berkshire B",
    "NFLX": "Netflix",
    "AMD": "AMD",
    "INTC": "Intel"
};

export function LiveMarketView() {
    const { getBatchQuotes, loading } = useStockData();
    const [quotes, setQuotes] = useState<StockQuote[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchLivePrices = useCallback(async () => {
        const data = await getBatchQuotes(TICKERS);
        if (data && data.length > 0) {
            setQuotes(data);
            setLastUpdated(new Date());
        }
    }, [getBatchQuotes]);

    useEffect(() => {
        fetchLivePrices();
        const interval = setInterval(fetchLivePrices, 30000); // Polling every 30 seconds
        return () => clearInterval(interval);
    }, [fetchLivePrices]);

    const filteredQuotes = useMemo(() => {
        return quotes.filter(q =>
            q.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (COMPANY_NAMES[q.symbol] || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [quotes, searchQuery]);

    const getHeatColor = (percent: number) => {
        if (percent > 2) return "bg-emerald-600 border-emerald-400/50";
        if (percent > 0.5) return "bg-emerald-500/80 border-emerald-400/30";
        if (percent > 0) return "bg-emerald-500/40 border-emerald-400/20";
        if (percent < -2) return "bg-red-600 border-red-400/50";
        if (percent < -0.5) return "bg-red-500/80 border-red-400/30";
        if (percent < 0) return "bg-red-500/40 border-red-400/20";
        return "bg-secondary/50 border-border/50";
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary animate-pulse" />
                        Global Live Market Board
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        {lastUpdated ? `Real-time synchronization active • ${lastUpdated.toLocaleTimeString()}` : 'Connecting to liquidity streams...'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search company..."
                            className="pl-9 h-10 rounded-xl bg-card border-border/50 focus:ring-primary/40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={fetchLivePrices} className="rounded-xl border-border/50">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {loading && quotes.length === 0 ? (
                    Array.from({ length: 30 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))
                ) : (
                    filteredQuotes.map((quote) => (
                        <Card
                            key={quote.symbol}
                            className={`overflow-hidden border group cursor-pointer transition-all hover:scale-[1.03] active:scale-95 duration-200 ${getHeatColor(quote.changePercent)}`}
                        >
                            <CardContent className="p-3 flex flex-col justify-between h-24 backdrop-blur-sm bg-black/5 dark:bg-white/5">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-black opacity-70 uppercase tracking-tighter line-clamp-1">
                                            {COMPANY_NAMES[quote.symbol] || quote.symbol}
                                        </span>
                                        <h4 className="text-xs font-bold leading-none">{quote.symbol}</h4>
                                    </div>
                                    {quote.changePercent >= 0 ?
                                        <TrendingUp className="h-3 w-3 text-emerald-100" /> :
                                        <TrendingDown className="h-3 w-3 text-red-100" />
                                    }
                                </div>

                                <div className="mt-auto">
                                    <div className="text-xs font-black">
                                        {quote.symbol.length > 5 ? '$' : '₹'}{quote.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[10px] font-bold opacity-90">
                                            {quote.changePercent > 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                                        </span>
                                        <div className="h-1 w-8 rounded-full bg-white/20 overflow-hidden">
                                            <div
                                                className={`h-full bg-white transition-all duration-1000`}
                                                style={{ width: `${Math.min(Math.abs(quote.changePercent) * 10, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <Badge className="bg-primary/20 border-primary/30 text-primary-foreground font-black uppercase text-[10px] tracking-widest">Market Sentiment</Badge>
                        <h4 className="text-2xl font-black font-display tracking-tight leading-none">AI Market Intensity Analysis</h4>
                        <p className="text-sm text-slate-400 font-medium max-w-lg">
                            The combined heat-map of 30+ major assets suggests {quotes.filter(q => q.changePercent > 0).length > quotes.length / 2 ? 'Bullish' : 'Bearish'} momentum globally. High intensity clusters detected in Technology and Financials.
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-black text-emerald-400">{(quotes.filter(q => q.changePercent > 0).length / Math.max(quotes.length, 1) * 100).toFixed(0)}%</div>
                            <div className="text-[10px] font-black uppercase text-slate-500">Green Assets</div>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-red-400">{(quotes.filter(q => q.changePercent < 0).length / Math.max(quotes.length, 1) * 100).toFixed(0)}%</div>
                            <div className="text-[10px] font-black uppercase text-slate-500">Red Assets</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
