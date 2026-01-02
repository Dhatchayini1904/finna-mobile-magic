import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 animate-fade-in", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-card",
          isUser 
            ? "bg-gradient-to-br from-primary to-emerald-600" 
            : "bg-gradient-to-br from-secondary to-muted"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-card",
          isUser
            ? "bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground rounded-br-sm"
            : "glass rounded-bl-sm"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p
            className={cn(
              "text-xs mt-2 opacity-70",
              isUser ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
