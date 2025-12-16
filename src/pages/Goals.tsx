import { Button } from "@/components/ui/button";
import { GoalsOverview } from "@/components/goals/GoalsOverview";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalWallet } from "@/components/goals/GoalWallet";
import { GoalInsights } from "@/components/goals/GoalInsights";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { Plus } from "lucide-react";

const goals = [
  {
    name: "Emergency Fund",
    target: 300000,
    current: 150000,
    deadline: "Jun 2025",
    category: "emergency",
    icon: "🛡️",
    monthlyContribution: 15000,
  },
  {
    name: "Europe Trip",
    target: 200000,
    current: 85000,
    deadline: "Dec 2025",
    category: "travel",
    icon: "✈️",
    monthlyContribution: 10000,
  },
  {
    name: "New Car",
    target: 800000,
    current: 200000,
    deadline: "Dec 2026",
    category: "vehicle",
    icon: "🚗",
    monthlyContribution: 25000,
  },
  {
    name: "MBA Education",
    target: 500000,
    current: 50000,
    deadline: "Aug 2025",
    category: "education",
    icon: "🎓",
    monthlyContribution: 20000,
  },
  {
    name: "Home Down Payment",
    target: 2000000,
    current: 450000,
    deadline: "Dec 2027",
    category: "home",
    icon: "🏠",
    monthlyContribution: 35000,
  },
  {
    name: "Retirement Fund",
    target: 5000000,
    current: 800000,
    deadline: "Dec 2045",
    category: "retirement",
    icon: "🏖️",
    monthlyContribution: 15000,
  },
];

const goalQuickPrompts = [
  "How to save faster?",
  "Prioritize my goals",
  "Am I on track?",
  "Best savings strategies",
];

export default function Goals() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Financial Goals</h1>
          <p className="text-muted-foreground">Track your savings targets</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>

      <GoalsOverview />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <GoalCard key={goal.name} {...goal} />
            ))}
          </div>
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
    </div>
  );
}
