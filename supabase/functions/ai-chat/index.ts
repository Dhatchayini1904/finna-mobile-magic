import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ChatContext = "budget" | "investment" | "goal" | "learn" | "general";

const VALID_CONTEXTS: ChatContext[] = ["budget", "investment", "goal", "learn", "general"];
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

// Mock financial context for AI insights
const financialContext = `
User's Financial Summary:
- Total Balance Across Accounts: ₹4,38,960
- Monthly Income: ₹1,02,500
- Monthly Expenses: ₹31,342
- Net Savings: ₹71,158
- Month-over-Month Change: +12.5%

Bank Accounts:
- HDFC Savings (savings): ₹2,84,650
- ICICI Current (checking): ₹45,230
- SBI Credit Card (credit): -₹15,420
- Zerodha Demat (investment): ₹1,24,500

Top Spending Categories:
- Investments: ₹10,000 (32%)
- Shopping: ₹4,599 (15%)
- Food & Dining: ₹3,256 (10%)
- Transportation: ₹3,320 (11%)
- Utilities: ₹3,449 (11%)

Recent Transactions:
- Salary Credit: +₹85,000 (Salary)
- Grocery Shopping: -₹3,450 (Groceries)
- Electricity Bill: -₹2,850 (Utilities)
- Netflix Subscription: -₹649 (Entertainment)
- Freelance Payment: +₹15,000 (Freelance)
- Swiggy Order: -₹456 (Food & Dining)
- Uber Ride: -₹320 (Transportation)
- Amazon Shopping: -₹4,599 (Shopping)
- Gym Membership: -₹2,500 (Health)
- Mutual Fund SIP: -₹10,000 (Investments)
`;

const systemPrompts: Record<ChatContext, string> = {
  budget: `You are FINNAVA's Budget AI Assistant, a friendly and knowledgeable financial advisor specializing in budgeting and expense management.

${financialContext}

Using the above financial data, help users:
- Analyze their spending patterns and suggest improvements
- Create and optimize monthly budgets
- Identify areas where they can save money
- Set realistic spending limits by category
- Track and reduce unnecessary expenses
Keep responses concise, actionable, and encouraging. Use ₹ for currency. Reference their actual spending data.`,

  investment: `You are FINNAVA's Investment AI Advisor, an expert in Indian stock markets and investment strategies.

${financialContext}

Using the above financial data, help users:
- Analyze stock recommendations with target prices and confidence levels
- Understand market trends and sector performance
- Build diversified portfolios suited to their risk tolerance
- Time their investments using technical and fundamental analysis
- Make informed decisions about buying, holding, or selling stocks
Provide specific, data-driven insights. Use ₹ for currency and reference NSE/BSE stocks.`,

  goal: `You are FINNAVA's Goals AI Coach, specializing in helping users achieve their financial dreams.

${financialContext}

Using the above financial data, help users:
- Set SMART financial goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Create savings plans with realistic timelines
- Track progress and stay motivated
- Prioritize multiple goals effectively
- Adjust strategies when circumstances change
Be supportive and celebrate progress. Use ₹ for currency. Reference their current savings rate.`,

  learn: `You are FINNAVA's Financial Education AI Tutor, making complex financial concepts easy to understand.

${financialContext}

Help users:
- Learn about investing, budgeting, and personal finance
- Understand financial terms and jargon in simple language
- Discover strategies for building wealth over time
- Navigate taxes, insurance, and retirement planning
- Make informed financial decisions with confidence
Use examples, analogies, and step-by-step explanations. Reference Indian financial context.`,

  general: `You are FINNAVA's AI Assistant, a comprehensive financial advisor for Indian users.

${financialContext}

Using the above financial data, you can help with:
- Budget planning and expense tracking
- Investment advice and stock analysis
- Financial goal setting and tracking
- Financial education and literacy
Be helpful, concise, and always use ₹ for currency. Provide actionable advice based on their actual financial situation.`
};

// Input validation
function validateInput(body: unknown): { messages: Array<{ role: string; content: string }>; context: ChatContext } | null {
  if (!body || typeof body !== 'object') return null;
  
  const { messages, context = "general" } = body as Record<string, unknown>;
  
  // Validate context
  if (!VALID_CONTEXTS.includes(context as ChatContext)) {
    return null;
  }
  
  // Validate messages
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return null;
  }
  
  // Validate each message
  for (const msg of messages) {
    if (typeof msg !== 'object' || msg === null) return null;
    const { role, content } = msg as Record<string, unknown>;
    
    if (typeof role !== 'string' || !['user', 'assistant'].includes(role)) return null;
    if (typeof content !== 'string' || content.length === 0 || content.length > MAX_MESSAGE_LENGTH) return null;
  }
  
  return { 
    messages: messages as Array<{ role: string; content: string }>, 
    context: context as ChatContext 
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration missing');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`AI chat request from user: ${user.id}`);

    // Parse and validate input
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validatedInput = validateInput(requestBody);
    if (!validatedInput) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, context } = validatedInput;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = systemPrompts[context];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
