import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  budget_limit: number;
  spent: number;
  period: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface BudgetInsert {
  category: string;
  budget_limit: number;
  spent?: number;
  period?: string;
  icon?: string;
  color?: string;
}

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBudgets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch budgets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (budget: BudgetInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          ...budget,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setBudgets(prev => [data, ...prev]);
      toast.success('Budget created successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to create budget');
      console.error(error);
      return null;
    }
  };

  const updateBudget = async (id: string, updates: Partial<BudgetInsert>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBudgets(prev => prev.map(b => b.id === id ? data : b));
      toast.success('Budget updated successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to update budget');
      console.error(error);
      return null;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBudgets(prev => prev.filter(b => b.id !== id));
      toast.success('Budget deleted successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete budget');
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  return {
    budgets,
    loading,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
};
