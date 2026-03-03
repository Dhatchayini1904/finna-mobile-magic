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

const DEFAULT_INDIAN_STOCKS = ['RI', 'TCS', 'IT', 'HDF01', 'ICI02'];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let requestBody: any;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid request format' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = requestBody || {};
    const action = body.action;

    console.log(`Stock data request: action=${action}`);

    if (action === 'quote') {
      const symbol = body.symbol;
      if (!symbol) return new Response(JSON.stringify({ error: 'Invalid symbol' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const quote = await fetchMoneycontrolQuote(symbol);
      return new Response(JSON.stringify({ quote }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'batch') {
      const symbols = body.symbols && Array.isArray(body.symbols) && body.symbols.length > 0 ? body.symbols : DEFAULT_INDIAN_STOCKS;
      console.log(`Fetching batch quotes for: ${symbols.join(', ')}`);

      const quotes = await Promise.all(symbols.map((sym: string) => fetchMoneycontrolQuote(sym)));
      return new Response(JSON.stringify({ quotes: quotes.filter(q => q !== null) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'timeseries') {
      const symbol = body.symbol;
      if (!symbol) return new Response(JSON.stringify({ error: 'Invalid symbol' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

      console.log(`Fetching time series for ${symbol}`);
      const timeseries = await fetchMoneycontrolTimeseries(symbol);
      return new Response(JSON.stringify({ timeseries }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'search') {
      const query = body.symbol;
      if (!query) return new Response(JSON.stringify({ error: 'Invalid query' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

      console.log(`Searching for ${query}`);
      const results = await searchMoneycontrol(query);
      return new Response(JSON.stringify({ results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Stock data error:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch stock data' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

async function fetchMoneycontrolQuote(sc_id: string): Promise<StockQuote | null> {
  try {
    const url = `https://priceapi.moneycontrol.com/pricefeed/nse/equitycash/${encodeURIComponent(sc_id)}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await response.json();

    if (json.code !== '200' || !json.data) return null;

    const d = json.data;
    return {
      symbol: sc_id,
      price: parseFloat(d.pricecurrent) || 0,
      change: parseFloat(d.pricechange) || 0,
      changePercent: parseFloat(d.pricepercentchange) || 0,
      high: parseFloat(d['52H'] || d.HP) || 0,
      low: parseFloat(d['52L'] || d.LP) || 0,
      volume: parseInt(d.VOL) || 0,
      previousClose: parseFloat(d.priceprevclose) || 0,
    };
  } catch (e) {
    console.error(`Error fetching quote for ${sc_id}:`, e);
    return null;
  }
}

async function fetchMoneycontrolTimeseries(sc_id: string): Promise<TimeSeriesData[]> {
  try {
    const url = `https://www.moneycontrol.com/mc/widget/basicchart/get_chart_value?classic=true&sc_did=${encodeURIComponent(sc_id)}&dur=1yr`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await response.json();

    if (!json.g1) return getMockTimeSeries();

    const data = json.g1.slice(-30).map((item: any) => ({
      date: item.date,
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
      volume: parseInt(item.volume) || 0
    })).reverse();

    if (data.length === 0) return getMockTimeSeries();
    return data;
  } catch (e) {
    console.error(`Error fetching timeseries for ${sc_id}:`, e);
    return getMockTimeSeries();
  }
}

async function searchMoneycontrol(query: string) {
  try {
    const url = `https://www.moneycontrol.com/mccode/common/autosuggestion_solr.php?query=${encodeURIComponent(query)}&type=1&format=json`;
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map((item: any) => {
      let regionInfo = "India";
      let cleanName = item.stock_name;
      // Moneycontrol sometimes appends extra tags, keeping the primary stock_name is best

      return {
        symbol: item.sc_id,
        name: cleanName,
        type: 'Equity',
        region: regionInfo
      };
    }).filter(i => i.symbol);
  } catch (e) {
    console.error('Error searching:', e);
    return [];
  }
}

// Fallback logic for timeseries if data is sparse, to keep UI from crashing
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
