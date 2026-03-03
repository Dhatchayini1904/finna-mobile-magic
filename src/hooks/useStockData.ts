import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

export const useStockData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPolygonQuote = async (symbol: string): Promise<StockQuote | null> => {
    if (!POLYGON_API_KEY) return null;

    try {
      // Polygon typically uses ticker like AAPL or NSE:RELIANCE
      const ticker = symbol.includes(':') ? symbol.split(':')[1] : symbol;
      const response = await fetch(
        `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${POLYGON_API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        return {
          symbol,
          price: data.results.p,
          change: 0,
          changePercent: 0,
          high: data.results.p,
          low: data.results.p,
          volume: data.results.s,
          previousClose: data.results.p
        };
      }

      // Also check aggregates for more detail if trade is insufficient
      const aggResponse = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`
      );
      const aggData = await aggResponse.json();

      if (aggData.results && aggData.results[0]) {
        const res = aggData.results[0];
        return {
          symbol,
          price: res.c,
          change: res.c - res.o,
          changePercent: ((res.c - res.o) / res.o) * 100,
          high: res.h,
          low: res.l,
          volume: res.v,
          previousClose: res.o
        };
      }
      return null;
    } catch (e) {
      console.error(`Polygon fetch failed for ${symbol}:`, e);
      return null;
    }
  };

  const getBatchQuotes = useCallback(async (symbols?: string[]): Promise<StockQuote[]> => {
    if (!symbols || symbols.length === 0) return [];
    setLoading(true);
    setError(null);

    try {
      const quotes: StockQuote[] = [];

      await Promise.all(symbols.map(async (sym) => {
        try {
          // Try Polygon First
          const polyQuote = await fetchPolygonQuote(sym);
          if (polyQuote) {
            quotes.push(polyQuote);
            return;
          }

          // Fallback to Google Finance
          const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.google.com/finance/quote/${sym}:NSE`)}`;
          const response = await fetch(url);
          const data = await response.json();
          const html = data.contents;
          if (!html) return;

          const priceMatch = html.match(/class="YMlKec fxKbKc"[^>]*>₹?([0-9,.]+)/);
          const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;

          let changePercent = 0;
          let change = 0;
          // Look for positive or negative change span
          const changePctMatch = html.match(/class="JwB6kf"[^>]*>.*?<div class="Pzzkfc"[^>]*>.*?<span[^>]*>([+-]?[0-9.,]+)%<\/span>/is);
          if (changePctMatch) {
            changePercent = parseFloat(changePctMatch[1]);
          } else {
            const anyPctMatch = html.match(/class="Nyd5ke"[^>]*>.*?<span[^>]*>([+-]?[0-9.,]+)%<\/span>/is);
            if (anyPctMatch) changePercent = parseFloat(anyPctMatch[1]);
          }

          let volume = 0;
          const volMatch = html.match(/Volume<\/div>.*?class="P6K39c"[^>]*>([^<]+)<\/div>/is);
          if (volMatch) {
            let v = volMatch[1].replace(/,/g, '');
            if (v.includes('M')) volume = parseFloat(v) * 1000000;
            else if (v.includes('B')) volume = parseFloat(v) * 1000000000;
            else if (v.includes('Cr')) volume = parseFloat(v) * 10000000;
            else if (v.includes('L')) volume = parseFloat(v) * 100000;
            else volume = parseFloat(v);
          }

          let low = price, high = price;
          const rangeMatch = html.match(/Day range<\/div>.*?class="P6K39c"[^>]*>₹?([0-9.,]+)\s*-\s*₹?([0-9.,]+)<\/div>/is);
          if (rangeMatch) {
            low = parseFloat(rangeMatch[1].replace(/,/g, ''));
            high = parseFloat(rangeMatch[2].replace(/,/g, ''));
          }

          quotes.push({
            symbol: sym,
            price,
            change: 0, // Not explicitly fetched but percent is what matters
            changePercent,
            high,
            low,
            volume,
            previousClose: price
          });
        } catch (e) {
          console.error(`Failed to fetch Google Finance for ${sym}`, e);
        }
      }));

      return quotes;
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuote = useCallback(async (symbol: string): Promise<StockQuote | null> => {
    const list = await getBatchQuotes([symbol]);
    return list.length > 0 ? list[0] : null;
  }, [getBatchQuotes]);

  const getTimeSeries = useCallback(async (symbol: string): Promise<TimeSeriesData[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('stock-data', {
        body: { action: 'timeseries', symbol }
      });

      if (fnError) throw fnError;
      return data?.timeseries || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchStocks = useCallback(async (query: string): Promise<SearchResult[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('stock-data', {
        body: { action: 'search', symbol: query }
      });

      if (fnError) throw fnError;
      return data?.results || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getQuote,
    getBatchQuotes,
    getTimeSeries,
    searchStocks
  };
};
