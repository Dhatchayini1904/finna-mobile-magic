import { Button } from "@/components/ui/button";
import { TrendingUp, PiggyBank, Receipt, Target, Lightbulb, CreditCard } from "lucide-react";

const prompts = [
  { icon: TrendingUp, text: "How's my spending this month?" },
  { icon: PiggyBank, text: "Tips to save more money" },
  { icon: Receipt, text: "Analyze my subscriptions" },
  { icon: Target, text: "Am I on track for my goals?" },
  { icon: Lightbulb, text: "Investment recommendations" },
  { icon: CreditCard, text: "Reduce my expenses" },
];

interface QuickPromptsProps {
  onSelect: (prompt: string) => void;
}

export function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <Button
          key={prompt.text}
          variant="outline"
          size="sm"
          className="gap-2 bg-card/50 border-border/50 hover:bg-card hover:border-primary/50"
          onClick={() => onSelect(prompt.text)}
        >
          <prompt.icon className="h-4 w-4 text-primary" />
          {prompt.text}
        </Button>
      ))}
    </div>
  );
}
