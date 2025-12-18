import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, TrendingDown, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useWatchlist, WatchlistItem } from "@/hooks/useWatchlist";
import { useStockData, StockQuote } from "@/hooks/useStockData";

export function Watchlist() {
  const { watchlist, loading: watchlistLoading, removeFromWatchlist } = useWatchlist();
  const { getBatchQuotes } = useStockData();
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  const fetchQuotes = async () => {
    if (watchlist.length === 0) return;
    
    setLoadingQuotes(true);
    try {
      const symbols = watchlist.map(item => item.symbol);
      const quotesData = await getBatchQuotes(symbols);
      const newQuotes = new Map<string, StockQuote>();
      quotesData.forEach(quote => {
        newQuotes.set(quote.symbol, quote);
      });
      setQuotes(newQuotes);
    } finally {
      setLoadingQuotes(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  if (watchlistLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Watchlist
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchQuotes} disabled={loadingQuotes}>
          <RefreshCw className={`h-4 w-4 ${loadingQuotes ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {watchlist.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Your watchlist is empty. Search and add stocks to track them.
          </p>
        ) : (
          <div className="space-y-2">
            {watchlist.map((item) => {
              const quote = quotes.get(item.symbol);
              
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.symbol}</span>
                      {quote && (
                        <Badge 
                          variant={quote.change >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {quote.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {quote.changePercent.toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {item.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {quote ? (
                      <div className="text-right">
                        <p className="font-semibold">${quote.price.toFixed(2)}</p>
                        <p className={`text-xs ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromWatchlist(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
