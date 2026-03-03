import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget, BudgetInsert } from "@/hooks/useBudgets";

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  budget_limit: z.number().min(1, "Budget limit must be greater than 0"),
  spent: z.number().min(0).optional(),
  period: z.string().default("monthly"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const categories = [
  { value: "Housing", icon: "🏠", color: "bg-blue-500" },
  { value: "Transportation", icon: "🚗", color: "bg-purple-500" },
  { value: "Shopping", icon: "🛒", color: "bg-pink-500" },
  { value: "Food & Dining", icon: "🍕", color: "bg-orange-500" },
  { value: "Utilities", icon: "⚡", color: "bg-yellow-500" },
  { value: "Entertainment", icon: "🎬", color: "bg-red-500" },
  { value: "Healthcare", icon: "💊", color: "bg-emerald-500" },
  { value: "Education", icon: "📚", color: "bg-cyan-500" },
  { value: "Personal", icon: "👤", color: "bg-indigo-500" },
  { value: "Other", icon: "📦", color: "bg-gray-500" },
];

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: Budget | null;
  onSubmit: (data: BudgetInsert) => Promise<any>;
}

export function BudgetForm({ open, onOpenChange, budget, onSubmit }: BudgetFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: budget?.category || "",
      budget_limit: budget?.budget_limit || 0,
      spent: budget?.spent || 0,
      period: budget?.period || "monthly",
      icon: budget?.icon || "",
      color: budget?.color || "",
    },
  });

  const handleSubmit = async (data: BudgetFormData) => {
    setLoading(true);
    try {
      const selectedCat = categories.find(c => c.value === data.category);
      await onSubmit({
        category: data.category,
        budget_limit: data.budget_limit,
        spent: data.spent,
        period: data.period,
        icon: selectedCat?.icon || data.icon,
        color: selectedCat?.color || data.color,
      });
      onOpenChange(false);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{budget ? "Edit Budget" : "Create Budget"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.value}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Limit (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Already Spent (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : budget ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
