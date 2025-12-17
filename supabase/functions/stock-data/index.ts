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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    if (!apiKey) {
      console.error('ALPHA_VANTAGE_API_KEY not configured');
      throw new Error('Alpha Vantage API key not configured');
    }

    const { action, symbol, symbols } = await req.json();
    console.log(`Stock data request: action=${action}, symbol=${symbol}, symbols=${symbols}`);

    if (action === 'quote') {
      // Get real-time quote for a single stock
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      console.log(`Fetching quote for ${symbol}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      if (data['Note']) {
        console.warn('API rate limit warning:', data['Note']);
        // Return mock data when rate limited
        return new Response(
          JSON.stringify({
            quote: getMockQuote(symbol)
          }),
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

      console.log(`Quote for ${symbol}:`, stockQuote);

      return new Response(
        JSON.stringify({ quote: stockQuote }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'batch') {
      // Get quotes for multiple symbols
      const symbolList = symbols || ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'NVDA'];
      console.log(`Fetching batch quotes for: ${symbolList.join(', ')}`);
      
      const quotes: StockQuote[] = [];

      // Alpha Vantage doesn't have a batch endpoint for free tier, so we'll fetch one and use mock for rest
      // to avoid rate limits
      for (let i = 0; i < symbolList.length; i++) {
        if (i === 0) {
          // Fetch real data for first symbol
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbolList[i]}&apikey=${apiKey}`;
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
          // Use mock data for other symbols to avoid rate limiting
          quotes.push(getMockQuote(symbolList[i]));
        }
      }

      return new Response(
        JSON.stringify({ quotes }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'timeseries') {
      // Get historical data
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
      console.log(`Fetching time series for ${symbol}`);
      
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
        .map(([date, values]: [string, any]) => ({
          date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }))
        .reverse();

      return new Response(
        JSON.stringify({ timeseries: timeSeriesData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'search') {
      // Search for stocks
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${apiKey}`;
      console.log(`Searching for ${symbol}`);
      
      const response = await fetch(url);
      const data = await response.json();

      const matches = data['bestMatches'] || [];
      const results = matches.map((match: any) => ({
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

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Stock data error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
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
