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
import { Transaction, TransactionInsert } from "@/hooks/useTransactions";

const transactionSchema = z.object({
  description: z.string().min(1, "Description is required").max(200),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  date: z.string().optional(),
  time: z.string().optional(),
  merchant: z.string().max(100).optional(),
  payment_method: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const expenseCategories = [
  { value: "Shopping", icon: "🛒" },
  { value: "Food & Dining", icon: "🍕" },
  { value: "Transport", icon: "🚗" },
  { value: "Entertainment", icon: "🎬" },
  { value: "Bills", icon: "📄" },
  { value: "Healthcare", icon: "💊" },
  { value: "Education", icon: "📚" },
  { value: "Other", icon: "📦" },
];

const incomeCategories = [
  { value: "Income", icon: "💼" },
  { value: "Salary", icon: "💰" },
  { value: "Freelance", icon: "💻" },
  { value: "Investment", icon: "📈" },
  { value: "Gift", icon: "🎁" },
  { value: "Other", icon: "📦" },
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Bank Transfer",
  "Wallet",
  "Auto-Pay",
];

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSubmit: (data: TransactionInsert) => Promise<any>;
}

export function TransactionForm({ open, onOpenChange, transaction, onSubmit }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction?.amount || 0,
      type: (transaction?.type as "income" | "expense") || "expense",
      category: transaction?.category || "",
      date: transaction?.date || new Date().toISOString().split('T')[0],
      time: transaction?.time || "",
      merchant: transaction?.merchant || "",
      payment_method: transaction?.payment_method || "",
    },
  });

  const selectedType = form.watch("type");
  const categories = selectedType === "income" ? incomeCategories : expenseCategories;

  const handleSubmit = async (data: TransactionFormData) => {
    setLoading(true);
    try {
      const selectedCat = categories.find(c => c.value === data.category);
      await onSubmit({
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        time: data.time,
        merchant: data.merchant,
        payment_method: data.payment_method,
        icon: selectedCat?.icon || "📦",
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
          <DialogTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="merchant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amazon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
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
                {loading ? "Saving..." : transaction ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
