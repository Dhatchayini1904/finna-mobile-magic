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
import { Goal, GoalInsert } from "@/hooks/useGoals";

const goalSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  target_amount: z.number().min(1, "Target must be greater than 0"),
  current_amount: z.number().min(0).optional(),
  deadline: z.string().optional(),
  category: z.string().optional(),
  icon: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

const categories = [
  { value: "emergency", icon: "🛡️", label: "Emergency Fund" },
  { value: "travel", icon: "✈️", label: "Travel" },
  { value: "vehicle", icon: "🚗", label: "Vehicle" },
  { value: "education", icon: "🎓", label: "Education" },
  { value: "home", icon: "🏠", label: "Home" },
  { value: "retirement", icon: "🏖️", label: "Retirement" },
  { value: "investment", icon: "📈", label: "Investment" },
  { value: "other", icon: "🎯", label: "Other" },
];

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSubmit: (data: GoalInsert) => Promise<any>;
}

export function GoalForm({ open, onOpenChange, goal, onSubmit }: GoalFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || "",
      target_amount: goal?.target_amount || 0,
      current_amount: goal?.current_amount || 0,
      deadline: goal?.deadline || "",
      category: goal?.category || "",
      icon: goal?.icon || "",
    },
  });

  const handleSubmit = async (data: GoalFormData) => {
    setLoading(true);
    try {
      const selectedCat = categories.find(c => c.value === data.category);
      await onSubmit({
        name: data.name,
        target_amount: data.target_amount,
        current_amount: data.current_amount,
        deadline: data.deadline,
        category: data.category,
        icon: selectedCat?.icon || data.icon || "🎯",
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
          <DialogTitle>{goal ? "Edit Goal" : "Create Goal"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Emergency Fund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                            <span>{cat.label}</span>
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
              name="target_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
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
              name="current_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Savings (₹)</FormLabel>
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
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : goal ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
