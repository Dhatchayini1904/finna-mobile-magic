import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  category?: string;
  icon?: string;
  color?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GoalInsert {
  name: string;
  target_amount: number;
  current_amount?: number;
  deadline?: string;
  category?: string;
  icon?: string;
  color?: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch goals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goal: GoalInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => [data, ...prev]);
      toast.success('Goal created successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to create goal');
      console.error(error);
      return null;
    }
  };

  const updateGoal = async (id: string, updates: Partial<GoalInsert>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? data : g));
      toast.success('Goal updated successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to update goal');
      console.error(error);
      return null;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Goal deleted successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to delete goal');
      console.error(error);
      return false;
    }
  };

  const addToGoal = async (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return null;

    const newAmount = goal.current_amount + amount;
    const isCompleted = newAmount >= goal.target_amount;

    return updateGoal(id, { 
      current_amount: newAmount,
      ...(isCompleted && { is_completed: true })
    } as any);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    refetch: fetchGoals,
  };
};
