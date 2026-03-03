import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { ChatInput } from "@/components/ai/ChatInput";
import { QuickPrompts } from "@/components/ai/QuickPrompts";
import { Sparkles, Bot, TrendingUp, Wallet, Target, BookOpen, AlertCircle } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AIChat() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    await sendMessage(content);
  };

  const capabilities = [
    { icon: Wallet, label: "Budget planning & optimization", color: "text-primary" },
    { icon: TrendingUp, label: "Investment recommendations", color: "text-emerald-400" },
    { icon: Target, label: "Financial goal tracking", color: "text-amber-400" },
    { icon: BookOpen, label: "Financial education", color: "text-blue-400" },
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col glass border-border/50 shadow-elevated">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-emerald-500 to-teal-500 flex items-center justify-center shadow-glow animate-pulse-glow">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-display flex items-center gap-2">
                  FINNAVA AI
                  <Badge variant="secondary" className="text-xs">Powered by AI</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Using your financial data
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      I can analyze your spending, provide investment advice, help you set financial goals, and more.
                    </p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="bg-card border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                {error && (
                  <Alert variant="destructive" className="mx-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border/50 bg-card/50">
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 space-y-4">
        <Card className="bg-gradient-to-br from-primary/10 via-card to-emerald-500/5 border-primary/20 shadow-glow">
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

        <Card className="glass border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">What I Can Help With</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {capabilities.map((cap, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                <cap.icon className={`h-5 w-5 ${cap.color}`} />
                <span className="text-sm text-muted-foreground">{cap.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <AlertCircle className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium">Demo Mode</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Using mock bank data for AI insights. Real-time market data is available for investments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
