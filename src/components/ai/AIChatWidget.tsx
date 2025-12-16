import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2, Trash2, Bot, User } from "lucide-react";
import { useAIChat, Message } from "@/hooks/useAIChat";
import { cn } from "@/lib/utils";

interface AIChatWidgetProps {
  context: "budget" | "investment" | "goal" | "learn" | "general";
  title: string;
  placeholder?: string;
  quickPrompts?: string[];
}

export function AIChatWidget({ 
  context, 
  title, 
  placeholder = "Ask me anything...",
  quickPrompts = []
}: AIChatWidgetProps) {
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat(context);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    sendMessage(prompt);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card/80 to-card backdrop-blur-sm border-primary/20 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearMessages} className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        {messages.length === 0 && quickPrompts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <Badge 
                key={i}
                variant="secondary" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickPrompt(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
        )}

        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-background/50"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      <div className={cn(
        "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-primary/20" : "bg-secondary"
      )}>
        {isUser ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn(
        "rounded-lg px-3 py-2 text-sm max-w-[85%]",
        isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
