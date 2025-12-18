import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  time?: string;
  merchant?: string;
  icon?: string;
  payment_method?: string;
  created_at: string;
}

export interface TransactionInsert {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date?: string;
  time?: string;
  merchant?: string;
  icon?: string;
  payment_method?: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: TransactionInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      toast.success('Transaction added successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to add transaction');
      console.error(error);
      return null;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<TransactionInsert>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Transaction updated successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to update transaction');
      console.error(error);
      return null;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transaction deleted successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete transaction');
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const stats = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.totalIncome += Number(t.amount);
      } else {
        acc.totalExpenses += Number(t.amount);
      }
      acc.count += 1;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, count: 0 }
  );

  return {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
    stats,
  };
};
