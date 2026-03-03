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
    console.log('Fetching Indian market news for category:', category);

    // Map Finna app categories to appropriate Indian market RSS Feeds (Moneycontrol / Economic Times)
    const rssFeeds: Record<string, string> = {
      'markets': 'https://www.moneycontrol.com/rss/marketreports.xml',
      'economy': 'https://www.moneycontrol.com/rss/economy.xml',
      'technology': 'https://www.moneycontrol.com/rss/technology.xml',
      'commodities': 'https://www.moneycontrol.com/rss/commodities.xml',
      'crypto': 'https://www.moneycontrol.com/rss/cryptocurrency.xml',
      'ipo': 'https://www.moneycontrol.com/rss/iponews.xml',
      'general': 'https://www.moneycontrol.com/rss/business.xml',
    };

    const targetRssUrl = rssFeeds[category] || rssFeeds['general'];

    try {
      // Use rss2json free API to convert XML feed into easily parsable JSON
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetRssUrl)}&api_key=`;
      const response = await fetch(rss2jsonUrl);

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok' && data.items) {
          const articles = data.items.slice(0, 10).map((item: any, index: number) => {
            // Moneycontrol description often has gross HTML tracking tags, let's strip them quickly
            const cleanSummary = (item.description || '').replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';

            return {
              id: `${category}-${index}`,
              title: item.title,
              summary: cleanSummary,
              source: data.feed.title || 'Moneycontrol India',
              url: item.link,
              // Use RSS thumbnail if available, otherwise default to a financial splash
              image: item.thumbnail || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
              publishedAt: new Date(item.pubDate || Date.now()).toISOString(),
              category: category,
              sentiment: getSentiment(item.title + ' ' + cleanSummary),
            };
          });

          return new Response(
            JSON.stringify({ articles }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      console.warn('RSS API returned non-ok response or failed parsing');
    } catch (fetchError) {
      console.error('RSS fetch failed:', fetchError);
    }

    // Fallback to mock data if API fails
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
  const positiveWords = ['gain', 'rise', 'surge', 'rally', 'growth', 'profit', 'boost', 'record', 'success', 'up', 'jumps', 'soars'];
  const negativeWords = ['fall', 'drop', 'decline', 'loss', 'crash', 'concern', 'risk', 'fear', 'worry', 'down', 'slips', 'plunges'];

  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function getMockNews(category: string) {
  // Indian market specific mock data
  return [
    {
      id: '1',
      title: 'Sensex, Nifty hit lifetime highs as IT, banking shares rally',
      summary: 'Indian benchmark equity indices hit fresh lifetime highs today, driven by a strong rally in IT and banking heavyweights amid positive global cues.',
      source: 'Moneycontrol',
      url: '#',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      publishedAt: new Date().toISOString(),
      category: 'markets',
      sentiment: 'positive',
    },
    {
      id: '2',
      title: 'RBI Monetary Policy: Repo rate kept unchanged at 6.5%',
      summary: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India decided to keep the repo rate unchanged, continuing its stance on withdrawal of accommodation.',
      source: 'Economic Times',
      url: '#',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      category: 'economy',
      sentiment: 'neutral',
    },
    {
      id: '3',
      title: 'TCS, Infosys announce solid Q3 results, guiding for better FY25',
      summary: 'Top Indian IT firms have announced better than expected third-quarter results, indicating a stabilization in discretionary tech spending in the US.',
      source: 'Mint',
      url: '#',
      image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      category: 'technology',
      sentiment: 'positive',
    },
    {
      id: '4',
      title: 'Gold prices in India touch new records amid global shifts',
      summary: 'Domestically, 24-carat gold reached consecutive record highs, as safe-haven buying increased significantly following international market turbulence.',
      source: 'Business Standard',
      url: '#',
      image: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=400',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      category: 'commodities',
      sentiment: 'positive',
    },
    {
      id: '5',
      title: 'Upcoming IPOs this week: Four SME issues to hit Street',
      summary: 'The primary market looks robust as four small and medium enterprises (SMEs) prepare to launch their initial public offerings in the Indian market this week.',
      source: 'NDTV Profit',
      url: '#',
      image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      category: 'ipo',
      sentiment: 'neutral',
    },
  ];
}
