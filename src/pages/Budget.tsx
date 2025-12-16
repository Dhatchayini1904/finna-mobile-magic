import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategories } from "@/components/budget/BudgetCategories";
import { SpendingLimits } from "@/components/budget/SpendingLimits";
import { BudgetInsights } from "@/components/budget/BudgetInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";

const budgetQuickPrompts = [
  "How can I save more?",
  "Analyze my spending",
  "Reduce food expenses",
  "Set up 50/30/20 rule",
];

export default function Budget() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold font-display">Budget</h1>
        <p className="text-muted-foreground">Track spending and manage your monthly budget</p>
      </div>

      <BudgetOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <BudgetCategories />
          <SpendingLimits />
        </div>
        <div className="space-y-6">
          <BudgetInsights />
          <div className="h-[400px]">
            <AIChatWidget
              context="budget"
              title="Budget AI Assistant"
              placeholder="Ask about your budget..."
              quickPrompts={budgetQuickPrompts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
