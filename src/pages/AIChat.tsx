import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ChatInput } from "@/components/ai/ChatInput";
import { QuickPrompts } from "@/components/ai/QuickPrompts";
import { Sparkles, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI financial assistant. I can help you with budgeting, investment advice, spending analysis, and financial planning. What would you like to know?",
    timestamp: "10:00 AM",
  },
];

const sampleResponses: Record<string, string> = {
  "How's my spending this month?": "Based on your transactions, you've spent ₹45,230 this month, which is 12% less than last month. Your top categories are:\n\n• Food & Dining: ₹12,450 (28%)\n• Shopping: ₹9,800 (22%)\n• Transportation: ₹6,200 (14%)\n\nYou're doing great with your utilities budget - you're 15% under your target!",
  "Tips to save more money": "Here are personalized tips based on your spending patterns:\n\n1. **Reduce food delivery** - You spent ₹8,200 on Swiggy/Zomato. Try cooking 2 more meals at week to save ₹3,000/month.\n\n2. **Review subscriptions** - You have 6 active subscriptions totaling ₹2,450. Consider canceling unused ones.\n\n3. **Use public transport** - Switching Uber rides twice a week could save ₹2,500/month.\n\nImplementing these could save you ₹8,000+ monthly!",
  "default": "That's a great question! Based on your financial data, I can see you're managing your finances well. Would you like me to provide specific insights about your spending, savings, or investment opportunities?",
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = sampleResponses[content] || sampleResponses["default"];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">FINNAVA AI</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Online
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} {...message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border/50">
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 space-y-4">
        <Card className="bg-gradient-to-br from-primary/10 via-card/50 to-purple-500/10 border-primary/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Prompts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuickPrompts onSelect={handleSend} />
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">What I Can Help With</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Budget planning and optimization</p>
            <p>• Spending analysis and insights</p>
            <p>• Investment recommendations</p>
            <p>• Bill payment reminders</p>
            <p>• Savings goal tracking</p>
            <p>• Tax planning tips</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
