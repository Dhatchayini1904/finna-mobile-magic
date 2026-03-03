import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  monthly_income: number | null;
  occupation: string | null;
  risk_profile: 'conservative' | 'moderate' | 'aggressive' | null;
  financial_goals: string[];
  onboarding_completed: boolean;
  preferred_language: 'en' | 'ta';
  voice_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setProfile({
        ...data,
        financial_goals: Array.isArray(data.financial_goals) ? data.financial_goals : [],
        preferred_language: data.preferred_language || 'en',
        voice_enabled: data.voice_enabled ?? true,
        onboarding_completed: data.onboarding_completed ?? false,
      } as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const completeOnboarding = async (data: {
    monthly_income: number;
    occupation: string;
    risk_profile: 'conservative' | 'moderate' | 'aggressive';
    financial_goals: string[];
  }) => {
    return updateProfile({
      ...data,
      onboarding_completed: true,
    });
  };

  return {
    profile,
    loading,
    updateProfile,
    completeOnboarding,
    refetch: fetchProfile,
  };
}
