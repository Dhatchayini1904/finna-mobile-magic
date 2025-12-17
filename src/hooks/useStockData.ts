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

export const useStockData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(async (symbol: string): Promise<StockQuote | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('stock-data', {
        body: { action: 'quote', symbol }
      });

      if (fnError) throw fnError;
      return data?.quote || null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBatchQuotes = useCallback(async (symbols?: string[]): Promise<StockQuote[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('stock-data', {
        body: { action: 'batch', symbols }
      });

      if (fnError) throw fnError;
      return data?.quotes || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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
