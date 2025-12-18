import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image?: string;
  publishedAt: string;
  category: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (category?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('market-news', {
        body: { category: category || 'general' }
      });

      if (fnError) throw fnError;
      setNews(data?.articles || []);
    } catch (err: any) {
      setError(err.message);
      // Fallback to mock data
      setNews(getMockNews());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
};

function getMockNews(): NewsArticle[] {
  return [
    {
      id: '1',
      title: 'Markets Rally on Strong Earnings Reports',
      summary: 'Major indices posted gains as tech companies reported better-than-expected quarterly results, boosting investor confidence.',
      source: 'Financial Times',
      url: '#',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      publishedAt: new Date().toISOString(),
      category: 'markets',
      sentiment: 'positive',
    },
    {
      id: '2',
      title: 'RBI Holds Interest Rates Steady',
      summary: 'The Reserve Bank of India kept key rates unchanged in its latest policy meeting, citing balanced inflation outlook.',
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
      summary: 'Technology sector outperforms broader market as investors rotate back into growth stocks amid falling yields.',
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
      summary: 'Crude oil prices jumped 3% as OPEC+ announced production cuts, raising concerns about energy costs.',
      source: 'Reuters',
      url: '#',
      image: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?w=400',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      category: 'commodities',
      sentiment: 'negative',
    },
    {
      id: '5',
      title: 'New IPO Season Kicks Off',
      summary: 'Several highly anticipated initial public offerings are set to hit the market this quarter, generating investor excitement.',
      source: 'Mint',
      url: '#',
      image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=400',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      category: 'ipo',
      sentiment: 'positive',
    },
  ];
}
