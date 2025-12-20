-- Create price_alerts table for tracking stock price targets
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  target_price NUMERIC NOT NULL,
  current_price NUMERIC,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below')),
  is_triggered BOOLEAN NOT NULL DEFAULT false,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view own price alerts" 
ON public.price_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own price alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts" 
ON public.price_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create quizzes table for learning section
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read access for quizzes)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Anyone can read quizzes
CREATE POLICY "Anyone can view quizzes" 
ON public.quizzes 
FOR SELECT 
USING (true);

-- Create quiz_results table for tracking user quiz attempts
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create policies for quiz results
CREATE POLICY "Users can view own quiz results" 
ON public.quiz_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz results" 
ON public.quiz_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert sample quizzes
INSERT INTO public.quizzes (title, description, category, difficulty, questions) VALUES
('Investing Basics', 'Test your knowledge of fundamental investing concepts', 'Investing', 'beginner', '[
  {"question": "What is a stock?", "options": ["A type of bond", "A share of ownership in a company", "A government loan", "A savings account"], "correctAnswer": 1},
  {"question": "What does IPO stand for?", "options": ["Internal Portfolio Order", "Initial Public Offering", "Investment Portfolio Option", "International Purchase Order"], "correctAnswer": 1},
  {"question": "What is diversification?", "options": ["Putting all money in one stock", "Spreading investments across different assets", "Only investing in bonds", "Avoiding the stock market"], "correctAnswer": 1},
  {"question": "What is a mutual fund?", "options": ["A single stock", "A pool of money from many investors", "A government bond", "A bank loan"], "correctAnswer": 1},
  {"question": "What is the benefit of SIP?", "options": ["Guaranteed returns", "Rupee cost averaging", "No risk", "Fixed interest rate"], "correctAnswer": 1}
]'),
('Budgeting 101', 'Learn the basics of managing your monthly budget', 'Budgeting', 'beginner', '[
  {"question": "What is the 50/30/20 rule?", "options": ["50% savings, 30% needs, 20% wants", "50% needs, 30% wants, 20% savings", "50% wants, 30% savings, 20% needs", "50% investments, 30% savings, 20% expenses"], "correctAnswer": 1},
  {"question": "What is an emergency fund?", "options": ["Money for vacations", "Savings for unexpected expenses", "Investment in stocks", "Monthly budget"], "correctAnswer": 1},
  {"question": "How many months of expenses should an emergency fund cover?", "options": ["1 month", "3-6 months", "12 months", "24 months"], "correctAnswer": 1},
  {"question": "What is a fixed expense?", "options": ["Variable shopping", "Rent or EMI", "Entertainment", "Dining out"], "correctAnswer": 1}
]'),
('Stock Market Advanced', 'Advanced concepts for experienced investors', 'Stocks', 'advanced', '[
  {"question": "What is P/E ratio?", "options": ["Price to Equity", "Price to Earnings", "Profit to Expense", "Portfolio to Equity"], "correctAnswer": 1},
  {"question": "What does market cap indicate?", "options": ["Daily trading volume", "Total value of company shares", "Quarterly profit", "Dividend yield"], "correctAnswer": 1},
  {"question": "What is a bear market?", "options": ["Rising stock prices", "Falling stock prices over 20%", "Stable market", "New IPOs"], "correctAnswer": 1},
  {"question": "What is SEBI?", "options": ["Stock Exchange Board", "Securities and Exchange Board of India", "Share Exchange Bureau", "Securities Evaluation Board"], "correctAnswer": 1},
  {"question": "What is an ETF?", "options": ["Electronic Transfer Fund", "Exchange Traded Fund", "Equity Trust Fund", "External Trade Finance"], "correctAnswer": 1}
]');