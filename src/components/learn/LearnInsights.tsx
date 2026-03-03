import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lightbulb, TrendingUp, BookMarked, ChevronRight } from "lucide-react";

const tips = [
  {
    title: "Start with an emergency fund",
    description: "Aim for 3-6 months of expenses before investing",
    category: "Basics",
    icon: Lightbulb,
  },
  {
    title: "Power of compounding",
    description: "₹10,000/month at 12% becomes ₹1 Cr in 20 years",
    category: "Investing",
    icon: TrendingUp,
  },
  {
    title: "ELSS for tax saving",
    description: "Save up to ₹46,800 in taxes with 80C investments",
    category: "Tax",
    icon: BookMarked,
  },
];

export function LearnInsights() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card/80 to-card backdrop-blur-sm border-primary/20">
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg">Quick Tips</CardTitle>
        <Badge variant="secondary" className="ml-auto">AI Curated</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{tip.title}</p>
                  <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
