import { useState } from "react";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategories } from "@/components/budget/BudgetCategories";
import { SpendingLimits } from "@/components/budget/SpendingLimits";
import { BudgetInsights } from "@/components/budget/BudgetInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { BudgetForm } from "@/components/forms/BudgetForm";
import { useBudgets } from "@/hooks/useBudgets";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const budgetQuickPrompts = [
  "How can I save more?",
  "Analyze my spending",
  "Reduce food expenses",
  "Set up 50/30/20 rule",
];

export default function Budget() {
  const { budgets, loading, createBudget, updateBudget, deleteBudget } = useBudgets();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    if (editingBudget) {
      await updateBudget(editingBudget.id, data);
    } else {
      await createBudget(data);
    }
    setEditingBudget(null);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Budget</h1>
          <p className="text-muted-foreground">Track spending and manage your monthly budget</p>
        </div>
        <Button onClick={() => { setEditingBudget(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <BudgetOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <BudgetCategories 
            budgets={budgets} 
            loading={loading}
            onEdit={(budget) => { setEditingBudget(budget); setFormOpen(true); }}
            onDelete={deleteBudget}
          />
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

      <BudgetForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingBudget(null);
        }}
        budget={editingBudget}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
