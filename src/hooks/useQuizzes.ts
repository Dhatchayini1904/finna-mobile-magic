import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  answers: number[];
  completed_at: string;
}

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const parsedQuizzes = (data || []).map(quiz => ({
        ...quiz,
        questions: typeof quiz.questions === 'string' 
          ? JSON.parse(quiz.questions) 
          : quiz.questions
      })) as Quiz[];
      
      setQuizzes(parsedQuizzes);
    } catch (error: any) {
      toast.error('Failed to fetch quizzes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      const parsedResults = (data || []).map(result => ({
        ...result,
        answers: typeof result.answers === 'string'
          ? JSON.parse(result.answers)
          : result.answers
      })) as QuizResult[];
      
      setResults(parsedResults);
    } catch (error: any) {
      console.error(error);
    }
  };

  const submitQuizResult = async (quizId: string, answers: number[], score: number, totalQuestions: number) => {
    if (!user) {
      toast.error('Please sign in to save your quiz results');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.id,
          quiz_id: quizId,
          score,
          total_questions: totalQuestions,
          answers,
        })
        .select()
        .single();

      if (error) throw error;
      
      const parsedResult = {
        ...data,
        answers: typeof data.answers === 'string' ? JSON.parse(data.answers) : data.answers
      } as QuizResult;
      
      setResults(prev => [parsedResult, ...prev]);
      return parsedResult;
    } catch (error: any) {
      toast.error('Failed to save quiz result');
      console.error(error);
      return null;
    }
  };

  const getQuizResult = (quizId: string) => {
    return results.find(r => r.quiz_id === quizId);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  return {
    quizzes,
    results,
    loading,
    submitQuizResult,
    getQuizResult,
    refetchQuizzes: fetchQuizzes,
    refetchResults: fetchResults,
  };
};
