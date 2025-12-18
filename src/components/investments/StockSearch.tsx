import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Loader2, TrendingUp, TrendingDown, Star, StarOff } from "lucide-react";
import { useStockData, SearchResult, StockQuote } from "@/hooks/useStockData";
import { useWatchlist } from "@/hooks/useWatchlist";

export function StockSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [searching, setSearching] = useState(false);
  const { searchStocks, getQuote } = useStockData();
  const { addToWatchlist, isInWatchlist, removeFromWatchlist, watchlist } = useWatchlist();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const searchResults = await searchStocks(query);
      setResults(searchResults);
      
      // Fetch quotes for top results
      const quotePromises = searchResults.slice(0, 5).map(async (result) => {
        const quote = await getQuote(result.symbol);
        return { symbol: result.symbol, quote };
      });
      
      const quotesData = await Promise.all(quotePromises);
      const newQuotes = new Map<string, StockQuote>();
      quotesData.forEach(({ symbol, quote }) => {
        if (quote) newQuotes.set(symbol, quote);
      });
      setQuotes(newQuotes);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleWatchlistToggle = async (symbol: string, name: string) => {
    if (isInWatchlist(symbol)) {
      const item = watchlist.find(w => w.symbol === symbol);
      if (item) await removeFromWatchlist(item.id);
    } else {
      await addToWatchlist(symbol, name);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          Stock Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search stocks (e.g., AAPL, RELIANCE)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {results.slice(0, 8).map((result) => {
              const quote = quotes.get(result.symbol);
              const inWatchlist = isInWatchlist(result.symbol);
              
              return (
                <div
                  key={result.symbol}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{result.symbol}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {result.name}
                    </p>
                  </div>

                  {quote && (
                    <div className="text-right mx-4">
                      <p className="font-semibold">${quote.price.toFixed(2)}</p>
                      <p className={`text-sm flex items-center gap-1 ${
                        quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {quote.change >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {quote.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  )}

                  <Button
                    variant={inWatchlist ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleWatchlistToggle(result.symbol, result.name)}
                  >
                    {inWatchlist ? (
                      <StarOff className="h-4 w-4" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {results.length === 0 && query && !searching && (
          <p className="text-center text-muted-foreground py-4">
            No results found. Try a different search term.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
