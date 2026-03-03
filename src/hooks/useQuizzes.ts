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

      const defaultQuizzes: Quiz[] = [
        {
          id: 'def-1',
          title: 'Stock Market Basics',
          description: 'Fundamental concepts of the stock market.',
          category: 'Stocks',
          difficulty: 'beginner',
          questions: [
            { question: 'What is a dividend?', options: ['A tax on stocks', 'A share of profits paid to stockholders', 'A stock split', 'A loan to a company'], correctAnswer: 1 },
            { question: 'What does Nifty 50 represent?', options: ['Top 50 global stocks', 'Top 50 companies in India by market cap', 'The 50 most expensive stocks', '50 stocks with zero debt'], correctAnswer: 1 }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 'def-2',
          title: 'Tax Saving 101',
          description: 'Learn how to optimize your taxes in India.',
          category: 'Tax',
          difficulty: 'intermediate',
          questions: [
            { question: 'Under which section of Income Tax can you claim deduction for LIC premium?', options: ['Section 80C', 'Section 80D', 'Section 24', 'Section 10(10D)'], correctAnswer: 0 },
            { question: 'What is the maximum limit for Section 80C deduction per year?', options: ['₹50,000', '₹1,00,000', '₹1,50,000', '₹2,00,000'], correctAnswer: 2 }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 'def-3',
          title: 'Gold as an Investment',
          description: 'Test your knowledge on SGBs and Physical Gold.',
          category: 'Commodities',
          difficulty: 'beginner',
          questions: [
            { question: 'What is Sovereign Gold Bond (SGB) interest rate per annum?', options: ['1%', '2.5%', '5%', '7.5%'], correctAnswer: 1 },
            { question: 'Is capital gains tax applicable on SGB if held till maturity?', options: ['Yes, 20%', 'Yes, 10%', 'No, it is exempt', 'Yes, added to income'], correctAnswer: 2 }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 'def-4',
          title: 'Retirement Planning',
          description: 'Basics of NPS, PPF and long-term wealth.',
          category: 'Planning',
          difficulty: 'intermediate',
          questions: [
            { question: 'Which of these is a pure equity retirement tool?', options: ['PPF', 'NPS (Tier 1)', 'EPF', 'Mutual Fund SIP'], correctAnswer: 3 },
            { question: 'What is the minimum lock-in for PPF?', options: ['3 years', '5 years', '15 years', '20 years'], correctAnswer: 2 }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 'def-5',
          title: 'The Inflation Challenge',
          description: 'Understanding purchasing power over time.',
          category: 'Economics',
          difficulty: 'advanced',
          questions: [
            { question: 'If inflation is 6% and your deposit earns 5%, what is your real return?', options: ['11%', '1%', '-1%', '0%'], correctAnswer: 2 },
            { question: 'Which asset is traditionally called an "inflation hedge"?', options: ['Cash', 'Bonds', 'Gold', 'Savings Account'], correctAnswer: 2 }
          ],
          created_at: new Date().toISOString()
        },
        {
          id: 'def-6',
          title: 'Insurance Essentials',
          description: 'Term vs Endowment and health coverage.',
          category: 'Planning',
          difficulty: 'beginner',
          questions: [
            { question: 'Which insurance is purely for protection with no maturity value?', options: ['Endowment', 'ULIP', 'Term Insurance', 'Money Back'], correctAnswer: 2 },
            { question: 'What is a "No Claim Bonus" in Health Insurance?', options: ['A cash reward', 'A discount on next premium', 'An increase in cover amount', 'A free medical checkup'], correctAnswer: 2 }
          ],
          created_at: new Date().toISOString()
        }
      ];

      setQuizzes(parsedQuizzes.length > 0 ? parsedQuizzes : defaultQuizzes);
    } catch (error: any) {
      const fallbackQuizzes: Quiz[] = [
        {
          id: 'fb-1',
          title: 'Financial Literacy IQ',
          description: 'A quick test of your general financial knowledge.',
          category: 'General',
          difficulty: 'beginner',
          questions: [
            { question: 'What is compound interest?', options: ['Interest on principal only', 'Interest on principal plus accumulated interest', 'A flat fee', 'Total debt'], correctAnswer: 1 }
          ],
          created_at: new Date().toISOString()
        }
      ];
      setQuizzes(fallbackQuizzes);
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
