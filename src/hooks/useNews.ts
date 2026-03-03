import { useState, useEffect, useCallback } from 'react';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  url: string;
  image?: string;
  publishedAt: string;
  category: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  aiAnalysis?: {
    summary: string;
    marketImpact: string;
    keyTakeaway: string;
  };
}

// Support for NewsAPI.org or GNews.io
// To use, add VITE_NEWS_API_KEY to your .env
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsFromPolygon = useCallback(async () => {
    if (!POLYGON_API_KEY) return [];

    try {
      const response = await fetch(
        `https://api.polygon.io/v2/reference/news?limit=50&apiKey=${POLYGON_API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        return data.results.map((article: any, index: number) => ({
          id: `polygon-news-${index}`,
          title: article.title,
          summary: article.description || article.title,
          source: article.publisher.name,
          url: article.article_url,
          image: article.image_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
          publishedAt: article.published_utc,
          category: 'Market',
          sentiment: analyzeSentiment(article.title)
        }));
      }
      return [];
    } catch (e) {
      console.error("Polygon News fetch error:", e);
      return [];
    }
  }, []);

  const fetchNewsFromAPI = useCallback(async () => {
    if (!NEWS_API_KEY) return null;

    try {
      // Using GNews.io structure as it provides a clean financial/business category
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=in&max=50&apikey=${NEWS_API_KEY}`
      );
      const data = await response.json();

      if (data.articles) {
        return data.articles.map((article: any, index: number) => ({
          id: `api-news-${index}`,
          title: article.title,
          summary: article.description,
          source: article.source.name,
          url: article.url,
          image: article.image || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
          publishedAt: article.publishedAt,
          category: 'Finance',
          sentiment: analyzeSentiment(article.title)
        }));
      }
      return null;
    } catch (e) {
      console.error("API News fetch error:", e);
      return null;
    }
  }, []);

  const fetchNewsFromRSS = useCallback(async () => {
    const FEEDS = [
      { name: 'Latest', url: 'https://www.moneycontrol.com/rss/latestnews.xml' },
      { name: 'Stocks', url: 'https://www.moneycontrol.com/rss/marketreports.xml' },
      { name: 'Business', url: 'https://www.moneycontrol.com/rss/business.xml' }
    ];

    try {
      const feedPromises = FEEDS.map(async (feed) => {
        const targetUrl = encodeURIComponent(feed.url);
        const response = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
        const data = await response.json();
        if (!data.contents) return [];

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        return Array.from(items).slice(0, 50).map((item, index) => {
          const title = item.querySelector("title")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();

          return {
            id: `rss-${feed.name}-${index}`,
            title: title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1'),
            summary: description.replace(/<[^>]*>?/gm, '').replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
            source: "Moneycontrol",
            url: link,
            image: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80`,
            publishedAt: new Date(pubDate).toISOString(),
            category: feed.name,
            sentiment: analyzeSentiment(title)
          };
        });
      });

      const results = await Promise.all(feedPromises);
      return results.flat();
    } catch (e) {
      console.error("RSS News fetch error:", e);
      return [];
    }
  }, []);

  const generateAISummary = (article: NewsArticle) => {
    // Simulate AI analysis based on keywords and sentiment
    const isPositive = article.sentiment === 'positive';
    const isNegative = article.sentiment === 'negative';
    const lowerTitle = article.title.toLowerCase();

    let marketImpact = "Neutral market expectations.";
    let keyTakeaway = "Maintain current portfolio allocation.";
    let aiSummary = "This development suggests steady growth in the relevant sector without immediate volatility risks.";

    if (isPositive) {
      marketImpact = "Bullish momentum detected. Positive sector sentiment.";
      keyTakeaway = "Evaluate potential long-term positions.";
      aiSummary = "The current trend indicates upward mobility. Market technicals support this development.";
    } else if (isNegative) {
      marketImpact = "Bearish signal. Structural concerns might impact valuation.";
      keyTakeaway = "Prioritize defensive asset allocation.";
      aiSummary = "Downside risks identified. Strategic reassessment of high-growth targets is advised.";
    }

    if (lowerTitle.includes('fed') || lowerTitle.includes('rbi') || lowerTitle.includes('rate')) {
      marketImpact += " High interest rate sensitivity.";
      keyTakeaway = "Monitor liquidity and yield curves.";
    }

    return {
      summary: aiSummary,
      marketImpact: marketImpact,
      keyTakeaway: keyTakeaway
    };
  };

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    let articles: NewsArticle[] = [];

    // Attempt all sources in parallel for efficiency
    try {
      const [apiArticles, polygonArticles, rssArticles] = await Promise.all([
        fetchNewsFromAPI(),
        fetchNewsFromPolygon(),
        fetchNewsFromRSS()
      ]);

      if (apiArticles) articles = [...articles, ...apiArticles];
      if (polygonArticles) articles = [...articles, ...polygonArticles];
      if (rssArticles) articles = [...articles, ...rssArticles];

      // If no API results, use RSS as fallback already handled by concat
    } catch (e) {
      console.error("Batch news fetch error:", e);
    }

    // Dedup by URL and Sort by date (desc)
    const uniqueArticles = Array.from(new Map(articles.map(a => [a.url, a])).values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Add AI Analysis to the first 10 main articles (increased from 5)
    const enhancedArticles = uniqueArticles.map((article, index) => {
      if (index < 10) {
        return {
          ...article,
          aiAnalysis: generateAISummary(article)
        };
      }
      return article;
    });

    setNews(enhancedArticles);
    setLoading(false);
  }, [fetchNewsFromAPI, fetchNewsFromRSS]);

  const fetchArticleContent = async (url: string) => {
    try {
      const targetUrl = encodeURIComponent(url);
      const response = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
      const data = await response.json();
      if (!data.contents) return null;

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      const contentEl = doc.querySelector('.article_pfx') || doc.querySelector('.content_wrapper') || doc.querySelector('.arti-flow');
      if (contentEl) return contentEl.innerHTML;

      const paragraphs = Array.from(doc.querySelectorAll('p'))
        .map(p => p.textContent)
        .filter(t => t && t.length > 50)
        .slice(0, 15);

      return paragraphs.join('\n\n');
    } catch (e) {
      console.error("Failed to fetch article content:", e);
      return null;
    }
  };

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { news, loading, error, refetch: fetchNews, fetchArticleContent };
};

function analyzeSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('rally') || lowerTitle.includes('surge') || lowerTitle.includes('gain') || lowerTitle.includes('up') || lowerTitle.includes('growth')) return 'positive';
  if (lowerTitle.includes('slump') || lowerTitle.includes('crash') || lowerTitle.includes('fall') || lowerTitle.includes('down') || lowerTitle.includes('loss')) return 'negative';
  return 'neutral';
}
