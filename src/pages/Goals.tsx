import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalWallet } from "@/components/goals/GoalWallet";
import { GoalInsights } from "@/components/goals/GoalInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { GoalForm } from "@/components/forms/GoalForm";
import { AddMoneyForm } from "@/components/forms/AddMoneyForm";
import { useGoals, Goal } from "@/hooks/useGoals";
import { Plus, Loader2 } from "lucide-react";
import { format } from "date-fns";

const goalQuickPrompts = [
  "How to save faster?",
  "Prioritize my goals",
  "Am I on track?",
  "Best savings strategies",
];

export default function Goals() {
  const { goals, loading, createGoal, updateGoal, deleteGoal, addToGoal } = useGoals();
  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [addMoneyGoal, setAddMoneyGoal] = useState<Goal | null>(null);

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleAddMoney = (goal: Goal) => {
    setAddMoneyGoal(goal);
  };

  const handleSubmit = async (data: any) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
    } else {
      await createGoal(data);
    }
    setEditingGoal(null);
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "No deadline";
    return format(new Date(deadline), "MMM yyyy");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Financial Goals</h1>
          <p className="text-muted-foreground">Track your savings targets</p>
        </div>
        <Button onClick={() => { setEditingGoal(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>

      <GoalsOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-lg border border-border/50">
              <p className="text-muted-foreground mb-4">No goals yet. Create your first savings goal!</p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  name={goal.name}
                  target={Number(goal.target_amount)}
                  current={Number(goal.current_amount)}
                  deadline={formatDeadline(goal.deadline || null)}
                  category={goal.category || "other"}
                  icon={goal.icon || "🎯"}
                  onEdit={() => handleEdit(goal)}
                  onDelete={() => deleteGoal(goal.id)}
                  onAddMoney={() => handleAddMoney(goal)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <GoalWallet />
          <GoalInsights />
          <div className="h-[400px]">
            <AIChatWidget
              context="goal"
              title="Goals AI Coach"
              placeholder="Ask about your goals..."
              quickPrompts={goalQuickPrompts}
            />
          </div>
        </div>
      </div>

      <GoalForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingGoal(null);
        }}
        goal={editingGoal}
        onSubmit={handleSubmit}
      />

      {addMoneyGoal && (
        <AddMoneyForm
          open={!!addMoneyGoal}
          onOpenChange={(open) => !open && setAddMoneyGoal(null)}
          goal={addMoneyGoal}
          onSubmit={addToGoal}
        />
      )}
    </div>
  );
}
