import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation
const VALID_CATEGORIES = ['general', 'forex', 'crypto', 'merger', 'markets', 'economy', 'technology', 'commodities', 'ipo'];
const MAX_CATEGORY_LENGTH = 20;

function validateCategory(category: unknown): string {
  if (typeof category !== 'string') return 'general';
  const trimmed = category.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > MAX_CATEGORY_LENGTH) return 'general';
  if (VALID_CATEGORIES.includes(trimmed)) return trimmed;
  return 'general';
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const body = requestBody as Record<string, unknown>;
    const category = validateCategory(body?.category);
    console.log('Fetching news for category:', category);

    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY') || '';

    // Try to fetch from Finnhub if API key is available
    if (FINNHUB_API_KEY) {
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/news?category=${encodeURIComponent(category)}&token=${FINNHUB_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          const articles = data.slice(0, 10).map((item: Record<string, unknown>, index: number) => ({
            id: String(index),
            title: item.headline,
            summary: item.summary,
            source: item.source,
            url: item.url,
            image: item.image,
            publishedAt: new Date((item.datetime as number) * 1000).toISOString(),
            category: item.category || category,
            sentiment: getSentiment(String(item.headline || '') + ' ' + String(item.summary || '')),
          }));

          return new Response(
            JSON.stringify({ articles }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.warn('Finnhub API returned non-ok response');
      } catch (fetchError) {
        console.error('Finnhub fetch failed:', fetchError);
      }
    }

    // Fallback to mock data
    const mockArticles = getMockNews(category);
    return new Response(
      JSON.stringify({ articles: mockArticles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: 'Unable to fetch news', articles: getMockNews('general') }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const lowerText = text.toLowerCase();
  const positiveWords = ['gain', 'rise', 'surge', 'rally', 'growth', 'profit', 'boost', 'record', 'success'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'crash', 'concern', 'risk', 'fear', 'worry'];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function getMockNews(category: string) {
  return [
    {
      id: '1',
      title: 'Markets Rally on Strong Earnings Reports',
      summary: 'Major indices posted gains as tech companies reported better-than-expected quarterly results, boosting investor confidence across global markets.',
      source: 'Financial Times',
      url: '#',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      publishedAt: new Date().toISOString(),
      category: 'markets',
      sentiment: 'positive',
    },
    {
      id: '2',
      title: 'Central Bank Holds Interest Rates Steady',
      summary: 'The central bank kept key rates unchanged in its latest policy meeting, citing balanced inflation outlook and economic stability.',
      source: 'Economic Times',
      url: '#',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      category: 'economy',
      sentiment: 'neutral',
    },
    {
      id: '3',
      title: 'Tech Stocks Lead Market Recovery',
      summary: 'Technology sector outperforms broader market as investors rotate back into growth stocks amid falling bond yields.',
      source: 'Bloomberg',
      url: '#',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      category: 'technology',
      sentiment: 'positive',
    },
    {
      id: '4',
      title: 'Oil Prices Surge on Supply Concerns',
      summary: 'Crude oil prices jumped on supply disruption concerns, raising questions about energy costs and inflation.',
      source: 'Reuters',
      url: '#',
      image: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=400',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      category: 'commodities',
      sentiment: 'negative',
    },
    {
      id: '5',
      title: 'Investors Eye New IPO Opportunities',
      summary: 'Several highly anticipated initial public offerings are set to hit the market this quarter, generating investor excitement.',
      source: 'Market Watch',
      url: '#',
      image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      category: 'ipo',
      sentiment: 'positive',
    },
  ];
}
