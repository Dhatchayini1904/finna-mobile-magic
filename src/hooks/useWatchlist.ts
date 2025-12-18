import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WatchlistItem {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  created_at: string;
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWatchlist = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWatchlist(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch watchlist');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol: string, name: string) => {
    if (!user) return null;

    // Check if already in watchlist
    const exists = watchlist.some(item => item.symbol === symbol);
    if (exists) {
      toast.error('Stock already in watchlist');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .insert({
          symbol,
          name,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setWatchlist(prev => [data, ...prev]);
      toast.success(`${symbol} added to watchlist`);
      return data;
    } catch (error: any) {
      toast.error('Failed to add to watchlist');
      console.error(error);
      return null;
    }
  };

  const removeFromWatchlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWatchlist(prev => prev.filter(item => item.id !== id));
      toast.success('Removed from watchlist');
      return true;
    } catch (error: any) {
      toast.error('Failed to remove from watchlist');
      console.error(error);
      return false;
    }
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(item => item.symbol === symbol);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [user]);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refetch: fetchWatchlist,
  };
};
