import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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

const VALID_ACTIONS = ['quote', 'batch', 'timeseries', 'search'] as const;
const MAX_SYMBOL_LENGTH = 20;
const MAX_BATCH_SYMBOLS = 20;
const SYMBOL_PATTERN = /^[A-Za-z0-9.&\- ]+$/;

type ValidAction = typeof VALID_ACTIONS[number];

function validateSymbol(symbol: unknown): string | null {
  if (typeof symbol !== 'string') return null;
  const trimmed = symbol.trim().toUpperCase();
  if (trimmed.length === 0 || trimmed.length > MAX_SYMBOL_LENGTH) return null;
  if (!SYMBOL_PATTERN.test(trimmed)) return null;
  return trimmed;
}

function validateAction(action: unknown): ValidAction | null {
  if (typeof action !== 'string') return null;
  if (VALID_ACTIONS.includes(action as ValidAction)) return action as ValidAction;
  return null;
}

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

// Default Indian stocks (BSE/NSE)
const DEFAULT_INDIAN_STOCKS = [
  'RELIANCE.BSE',
  'TCS.BSE', 
  'INFY.BSE',
  'HDFCBANK.BSE',
  'ICICIBANK.BSE',
];

serve(async (req) => {
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

      const quote = await fetchQuote(symbol, apiKey);
      return new Response(
        JSON.stringify({ quote }),
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
        symbolList = DEFAULT_INDIAN_STOCKS;
      }

      console.log(`Fetching batch quotes for: ${symbolList.join(', ')}`);
      const quotes: StockQuote[] = [];

      // Fetch first quote from API, rest use mock to avoid rate limits
      for (let i = 0; i < symbolList.length; i++) {
        if (i < 2) {
          // Fetch real data for first 2 to stay within rate limits
          const quote = await fetchQuote(symbolList[i], apiKey);
          quotes.push(quote);
          // Small delay between API calls
          if (i < symbolList.length - 1) {
            await new Promise(r => setTimeout(r, 1200));
          }
        } else {
          quotes.push(getIndianMockQuote(symbolList[i]));
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

      if (data['Note'] || data['Error Message'] || !data['Time Series (Daily)']) {
        console.warn('API issue, returning mock time series');
        return new Response(
          JSON.stringify({ timeseries: getMockTimeSeries() }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const timeSeries = data['Time Series (Daily)'];
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
      const query = body.symbol;
      if (typeof query !== 'string' || query.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid search query' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Searching for ${query}`);
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query.trim())}&apikey=${apiKey}`;
      
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

async function fetchQuote(symbol: string, apiKey: string): Promise<StockQuote> {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Error Message'] || data['Note']) {
      console.warn(`API issue for ${symbol}, using mock`);
      return getIndianMockQuote(symbol);
    }

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      console.log(`No data for ${symbol}, using mock`);
      return getIndianMockQuote(symbol);
    }

    return {
      symbol: quote['01. symbol'] || symbol,
      price: parseFloat(quote['05. price']) || 0,
      change: parseFloat(quote['09. change']) || 0,
      changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
      high: parseFloat(quote['03. high']) || 0,
      low: parseFloat(quote['04. low']) || 0,
      volume: parseInt(quote['06. volume']) || 0,
      previousClose: parseFloat(quote['08. previous close']) || 0,
    };
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err);
    return getIndianMockQuote(symbol);
  }
}

// Realistic Indian stock mock prices (INR)
function getIndianMockQuote(symbol: string): StockQuote {
  const mockPrices: Record<string, { price: number; name: string }> = {
    'RELIANCE.BSE': { price: 2935.50, name: 'Reliance Industries' },
    'TCS.BSE': { price: 3845.20, name: 'Tata Consultancy Services' },
    'INFY.BSE': { price: 1542.75, name: 'Infosys' },
    'HDFCBANK.BSE': { price: 1678.30, name: 'HDFC Bank' },
    'ICICIBANK.BSE': { price: 1245.60, name: 'ICICI Bank' },
    'HINDUNILVR.BSE': { price: 2456.90, name: 'Hindustan Unilever' },
    'SBIN.BSE': { price: 825.40, name: 'State Bank of India' },
    'BHARTIARTL.BSE': { price: 1580.25, name: 'Bharti Airtel' },
    'ITC.BSE': { price: 465.80, name: 'ITC' },
    'KOTAKBANK.BSE': { price: 1890.15, name: 'Kotak Mahindra Bank' },
    'LT.BSE': { price: 3520.60, name: 'Larsen & Toubro' },
    'WIPRO.BSE': { price: 485.30, name: 'Wipro' },
    'AXISBANK.BSE': { price: 1125.70, name: 'Axis Bank' },
    'TATAMOTORS.BSE': { price: 945.25, name: 'Tata Motors' },
    'MARUTI.BSE': { price: 12450.80, name: 'Maruti Suzuki' },
  };

  const stock = mockPrices[symbol];
  const price = stock?.price || 1000 + Math.random() * 2000;
  const change = (Math.random() - 0.45) * price * 0.03; // Slight upward bias
  
  return {
    symbol,
    price: Math.round(price * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round((change / price) * 10000) / 100,
    high: Math.round((price + Math.abs(change) + Math.random() * 20) * 100) / 100,
    low: Math.round((price - Math.abs(change) - Math.random() * 20) * 100) / 100,
    volume: Math.floor(1000000 + Math.random() * 10000000),
    previousClose: Math.round((price - change) * 100) / 100,
  };
}

function getMockTimeSeries(): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  let price = 2500;
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.48) * 50;
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Math.round((price - Math.random() * 20) * 100) / 100,
      high: Math.round((price + Math.random() * 30) * 100) / 100,
      low: Math.round((price - Math.random() * 30) * 100) / 100,
      close: Math.round(price * 100) / 100,
      volume: Math.floor(1000000 + Math.random() * 10000000),
    });
  }

  return data;
}
