import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
}

interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Input validation constants
const VALID_ACTIONS = ['quote', 'batch', 'timeseries', 'search'] as const;
const MAX_SYMBOL_LENGTH = 10;
const MAX_BATCH_SYMBOLS = 20;
const SYMBOL_PATTERN = /^[A-Z0-9.]+$/;

type ValidAction = typeof VALID_ACTIONS[number];

// Validate and sanitize symbol
function validateSymbol(symbol: unknown): string | null {
  if (typeof symbol !== 'string') return null;
  const trimmed = symbol.trim().toUpperCase();
  if (trimmed.length === 0 || trimmed.length > MAX_SYMBOL_LENGTH) return null;
  if (!SYMBOL_PATTERN.test(trimmed)) return null;
  return trimmed;
}

// Validate action
function validateAction(action: unknown): ValidAction | null {
  if (typeof action !== 'string') return null;
  if (VALID_ACTIONS.includes(action as ValidAction)) {
    return action as ValidAction;
  }
  return null;
}

// Validate symbols array
function validateSymbols(symbols: unknown): string[] | null {
  if (!Array.isArray(symbols)) return null;
  if (symbols.length === 0 || symbols.length > MAX_BATCH_SYMBOLS) return null;
  
  const validated: string[] = [];
  for (const sym of symbols) {
    const validSymbol = validateSymbol(sym);
    if (!validSymbol) return null;
    validated.push(validSymbol);
  }
  return validated;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      console.error('ALPHA_VANTAGE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Stock data service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!requestBody || typeof requestBody !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = requestBody as Record<string, unknown>;
    
    // Validate action
    const action = validateAction(body.action);
    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Invalid action parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Stock data request: action=${action}`);

    if (action === 'quote') {
      const symbol = validateSymbol(body.symbol);
      if (!symbol) {
        return new Response(
          JSON.stringify({ error: 'Invalid symbol parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Fetching quote for ${symbol}`);
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message']) {
        console.error('Alpha Vantage error for symbol:', symbol);
        return new Response(
          JSON.stringify({ quote: getMockQuote(symbol) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (data['Note']) {
        console.warn('API rate limit reached');
        return new Response(
          JSON.stringify({ quote: getMockQuote(symbol) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        console.log(`No data found for ${symbol}, returning mock data`);
        return new Response(
          JSON.stringify({ quote: getMockQuote(symbol) }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const stockQuote: StockQuote = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        volume: parseInt(quote['06. volume']),
        previousClose: parseFloat(quote['08. previous close'])
      };

      return new Response(
        JSON.stringify({ quote: stockQuote }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'batch') {
      let symbolList: string[];
      
      if (body.symbols) {
        const validated = validateSymbols(body.symbols);
        if (!validated) {
          return new Response(
            JSON.stringify({ error: 'Invalid symbols parameter' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        symbolList = validated;
      } else {
        symbolList = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'NVDA'];
      }

      console.log(`Fetching batch quotes for: ${symbolList.join(', ')}`);
      
      const quotes: StockQuote[] = [];

      for (let i = 0; i < symbolList.length; i++) {
        if (i === 0) {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbolList[i])}&apikey=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
            const quote = data['Global Quote'];
            quotes.push({
              symbol: quote['01. symbol'],
              price: parseFloat(quote['05. price']),
              change: parseFloat(quote['09. change']),
              changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
              high: parseFloat(quote['03. high']),
              low: parseFloat(quote['04. low']),
              volume: parseInt(quote['06. volume']),
              previousClose: parseFloat(quote['08. previous close'])
            });
          } else {
            quotes.push(getMockQuote(symbolList[i]));
          }
        } else {
          quotes.push(getMockQuote(symbolList[i]));
        }
      }

      return new Response(
        JSON.stringify({ quotes }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'timeseries') {
      const symbol = validateSymbol(body.symbol);
      if (!symbol) {
        return new Response(
          JSON.stringify({ error: 'Invalid symbol parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Fetching time series for ${symbol}`);
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data['Note'] || data['Error Message']) {
        console.warn('API issue, returning mock time series');
        return new Response(
          JSON.stringify({ timeseries: getMockTimeSeries() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const timeSeries = data['Time Series (Daily)'];
      if (!timeSeries) {
        return new Response(
          JSON.stringify({ timeseries: getMockTimeSeries() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const timeSeriesData: TimeSeriesData[] = Object.entries(timeSeries)
        .slice(0, 30)
        .map(([date, values]: [string, unknown]) => {
          const v = values as Record<string, string>;
          return {
            date,
            open: parseFloat(v['1. open']),
            high: parseFloat(v['2. high']),
            low: parseFloat(v['3. low']),
            close: parseFloat(v['4. close']),
            volume: parseInt(v['5. volume'])
          };
        })
        .reverse();

      return new Response(
        JSON.stringify({ timeseries: timeSeriesData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'search') {
      const symbol = validateSymbol(body.symbol);
      if (!symbol) {
        return new Response(
          JSON.stringify({ error: 'Invalid search query' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Searching for ${symbol}`);
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      const matches = data['bestMatches'] || [];
      const results = matches.map((match: Record<string, string>) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region']
      }));

      return new Response(
        JSON.stringify({ results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Stock data error:', error);
    return new Response(
      JSON.stringify({ error: 'Unable to fetch stock data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Mock data functions for when API is rate limited
function getMockQuote(symbol: string): StockQuote {
  const mockPrices: Record<string, number> = {
    'AAPL': 178.52,
    'GOOGL': 141.80,
    'MSFT': 378.91,
    'AMZN': 178.25,
    'NVDA': 495.22,
    'META': 505.95,
    'TSLA': 248.48,
    'BRK.B': 363.54,
    'JPM': 195.71,
    'V': 276.44
  };

  const price = mockPrices[symbol] || 100 + Math.random() * 200;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    symbol,
    price,
    change,
    changePercent: (change / price) * 100,
    high: price + Math.random() * 5,
    low: price - Math.random() * 5,
    volume: Math.floor(Math.random() * 50000000),
    previousClose: price - change
  };
}

function getMockTimeSeries(): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  let price = 150;
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * 5;
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: price - Math.random() * 2,
      high: price + Math.random() * 3,
      low: price - Math.random() * 3,
      close: price,
      volume: Math.floor(Math.random() * 50000000)
    });
  }

  return data;
}
