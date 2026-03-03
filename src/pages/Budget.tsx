import { useState } from "react";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { BudgetCategories } from "@/components/budget/BudgetCategories";
import { SpendingLimits } from "@/components/budget/SpendingLimits";
import { BudgetInsights } from "@/components/budget/BudgetInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { BudgetForm } from "@/components/forms/BudgetForm";
import { useBudgets } from "@/hooks/useBudgets";
import { Button } from "@/components/ui/button";
import { Plus, PieChart, Receipt, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bills from "./Bills";

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
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground flex items-center gap-3">
            <PieChart className="h-8 w-8 text-primary" />
            Budgeting & Bills
          </h1>
          <p className="text-muted-foreground text-sm font-medium italic">
            Strategic financial planning and structural expense management.
          </p>
        </div>
        <Button onClick={() => { setEditingBudget(null); setFormOpen(true); }} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      <Tabs defaultValue="planning" className="space-y-8">
        <TabsList className="bg-secondary/30 p-1.5 rounded-2xl border border-border/50 h-auto gap-1">
          <TabsTrigger value="planning" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest leading-none">
            <PieChart className="h-4 w-4" />
            Budget Planning
          </TabsTrigger>
          <TabsTrigger value="bills" className="flex-1 py-3 rounded-xl gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all font-black text-xs uppercase tracking-widest leading-none">
            <Receipt className="h-4 w-4" />
            Bills & Subscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
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
          </div>
        </TabsContent>

        <TabsContent value="bills" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Bills />
        </TabsContent>
      </Tabs>

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
