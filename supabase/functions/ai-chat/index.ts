import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ChatContext = "budget" | "investment" | "goal" | "learn" | "general";

const systemPrompts: Record<ChatContext, string> = {
  budget: `You are FINNAVA's Budget AI Assistant, a friendly and knowledgeable financial advisor specializing in budgeting and expense management. Help users:
- Analyze their spending patterns and suggest improvements
- Create and optimize monthly budgets
- Identify areas where they can save money
- Set realistic spending limits by category
- Track and reduce unnecessary expenses
Keep responses concise, actionable, and encouraging. Use ₹ for currency.`,

  investment: `You are FINNAVA's Investment AI Advisor, an expert in Indian stock markets and investment strategies. Help users:
- Analyze stock recommendations with target prices and confidence levels
- Understand market trends and sector performance
- Build diversified portfolios suited to their risk tolerance
- Time their investments using technical and fundamental analysis
- Make informed decisions about buying, holding, or selling stocks
Provide specific, data-driven insights. Use ₹ for currency and reference NSE/BSE stocks.`,

  goal: `You are FINNAVA's Goals AI Coach, specializing in helping users achieve their financial dreams. Help users:
- Set SMART financial goals (Specific, Measurable, Achievable, Relevant, Time-bound)
- Create savings plans with realistic timelines
- Track progress and stay motivated
- Prioritize multiple goals effectively
- Adjust strategies when circumstances change
Be supportive and celebrate progress. Use ₹ for currency.`,

  learn: `You are FINNAVA's Financial Education AI Tutor, making complex financial concepts easy to understand. Help users:
- Learn about investing, budgeting, and personal finance
- Understand financial terms and jargon in simple language
- Discover strategies for building wealth over time
- Navigate taxes, insurance, and retirement planning
- Make informed financial decisions with confidence
Use examples, analogies, and step-by-step explanations. Reference Indian financial context.`,

  general: `You are FINNAVA's AI Assistant, a comprehensive financial advisor for Indian users. You can help with:
- Budget planning and expense tracking
- Investment advice and stock analysis
- Financial goal setting and tracking
- Financial education and literacy
Be helpful, concise, and always use ₹ for currency. Provide actionable advice.`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context = "general" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = systemPrompts[context as ChatContext] || systemPrompts.general;

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
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
