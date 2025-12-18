import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Goal } from "@/hooks/useGoals";
import { Progress } from "@/components/ui/progress";

const addMoneySchema = z.object({
  amount: z.number().min(1, "Amount must be at least ₹1"),
});

type AddMoneyFormData = z.infer<typeof addMoneySchema>;

interface AddMoneyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  onSubmit: (goalId: string, amount: number) => Promise<any>;
}

export function AddMoneyForm({ open, onOpenChange, goal, onSubmit }: AddMoneyFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<AddMoneyFormData>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: 0,
    },
  });

  const watchedAmount = form.watch("amount") || 0;
  const newAmount = Number(goal.current_amount) + watchedAmount;
  const newProgress = Math.min((newAmount / Number(goal.target_amount)) * 100, 100);
  const currentProgress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;

  const handleSubmit = async (data: AddMoneyFormData) => {
    setLoading(true);
    try {
      await onSubmit(goal.id, data.amount);
      onOpenChange(false);
      form.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{goal.icon}</span>
            <span>Add Money to {goal.name}</span>
          </DialogTitle>
          <DialogDescription>
            Current: ₹{Number(goal.current_amount).toLocaleString()} / ₹{Number(goal.target_amount).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{currentProgress.toFixed(1)}% → {newProgress.toFixed(1)}%</span>
          </div>
          <Progress value={newProgress} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to Add (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              {[1000, 5000, 10000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => form.setValue("amount", amount)}
                >
                  +₹{amount.toLocaleString()}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || watchedAmount <= 0}>
                {loading ? "Adding..." : "Add Money"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
