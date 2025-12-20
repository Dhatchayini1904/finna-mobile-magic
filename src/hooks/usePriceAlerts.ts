import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PriceAlert {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  target_price: number;
  current_price: number | null;
  alert_type: 'above' | 'below';
  is_triggered: boolean;
  triggered_at: string | null;
  created_at: string;
}

export const usePriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAlerts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts((data || []) as PriceAlert[]);
    } catch (error: any) {
      toast.error('Failed to fetch price alerts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alert: {
    symbol: string;
    name: string;
    target_price: number;
    current_price?: number;
    alert_type: 'above' | 'below';
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert({
          ...alert,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setAlerts(prev => [data as PriceAlert, ...prev]);
      toast.success(`Price alert created for ${alert.symbol}`);
      return data;
    } catch (error: any) {
      toast.error('Failed to create price alert');
      console.error(error);
      return null;
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAlerts(prev => prev.filter(a => a.id !== id));
      toast.success('Price alert deleted');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete price alert');
      console.error(error);
      return false;
    }
  };

  const checkAlerts = async (quotes: { symbol: string; price: number }[]) => {
    const triggeredAlerts: PriceAlert[] = [];
    
    for (const alert of alerts) {
      if (alert.is_triggered) continue;
      
      const quote = quotes.find(q => q.symbol === alert.symbol);
      if (!quote) continue;
      
      const shouldTrigger = 
        (alert.alert_type === 'above' && quote.price >= alert.target_price) ||
        (alert.alert_type === 'below' && quote.price <= alert.target_price);
      
      if (shouldTrigger) {
        triggeredAlerts.push(alert);
        toast.success(
          `🔔 ${alert.symbol} hit ${alert.alert_type === 'above' ? 'above' : 'below'} ₹${alert.target_price}!`,
          { duration: 10000 }
        );
        
        await supabase
          .from('price_alerts')
          .update({ is_triggered: true, triggered_at: new Date().toISOString(), current_price: quote.price })
          .eq('id', alert.id);
      }
    }
    
    if (triggeredAlerts.length > 0) {
      fetchAlerts();
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  return {
    alerts,
    loading,
    createAlert,
    deleteAlert,
    checkAlerts,
    refetch: fetchAlerts,
  };
};
