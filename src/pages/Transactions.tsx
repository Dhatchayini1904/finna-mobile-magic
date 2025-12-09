import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionList, Transaction } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salary Deposit",
    category: "Income",
    amount: 85000,
    type: "income",
    date: "Today",
    time: "10:30 AM",
    icon: "💼",
    merchant: "TechCorp Inc.",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "2",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 649,
    type: "expense",
    date: "Today",
    time: "9:15 AM",
    icon: "🎬",
    merchant: "Netflix",
    paymentMethod: "Credit Card",
  },
  {
    id: "3",
    description: "Swiggy Order",
    category: "Food & Dining",
    amount: 450,
    type: "expense",
    date: "Today",
    time: "1:22 PM",
    icon: "🍕",
    merchant: "Swiggy",
    paymentMethod: "UPI",
  },
  {
    id: "4",
    description: "Grocery Shopping",
    category: "Shopping",
    amount: 3850,
    type: "expense",
    date: "Yesterday",
    time: "6:45 PM",
    icon: "🛒",
    merchant: "BigBasket",
    paymentMethod: "Debit Card",
  },
  {
    id: "5",
    description: "Freelance Payment",
    category: "Income",
    amount: 25000,
    type: "income",
    date: "Yesterday",
    time: "3:00 PM",
    icon: "💻",
    merchant: "Upwork",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "6",
    description: "Uber Ride",
    category: "Transport",
    amount: 380,
    type: "expense",
    date: "Yesterday",
    time: "9:30 AM",
    icon: "🚗",
    merchant: "Uber",
    paymentMethod: "UPI",
  },
  {
    id: "7",
    description: "Electricity Bill",
    category: "Bills",
    amount: 2450,
    type: "expense",
    date: "Dec 7, 2024",
    time: "11:00 AM",
    icon: "⚡",
    merchant: "BESCOM",
    paymentMethod: "Auto-Pay",
  },
  {
    id: "8",
    description: "Amazon Purchase",
    category: "Shopping",
    amount: 4999,
    type: "expense",
    date: "Dec 7, 2024",
    time: "8:15 PM",
    icon: "📦",
    merchant: "Amazon",
    paymentMethod: "Credit Card",
  },
  {
    id: "9",
    description: "Investment Returns",
    category: "Income",
    amount: 5200,
    type: "income",
    date: "Dec 6, 2024",
    time: "10:00 AM",
    icon: "📈",
    merchant: "Zerodha",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "10",
    description: "Gym Membership",
    category: "Shopping",
    amount: 2000,
    type: "expense",
    date: "Dec 6, 2024",
    time: "7:00 AM",
    icon: "🏋️",
    merchant: "Gold's Gym",
    paymentMethod: "UPI",
  },
  {
    id: "11",
    description: "Coffee Meeting",
    category: "Food & Dining",
    amount: 650,
    type: "expense",
    date: "Dec 5, 2024",
    time: "4:30 PM",
    icon: "☕",
    merchant: "Starbucks",
    paymentMethod: "Credit Card",
  },
  {
    id: "12",
    description: "Mobile Recharge",
    category: "Bills",
    amount: 599,
    type: "expense",
    date: "Dec 5, 2024",
    time: "12:00 PM",
    icon: "📱",
    merchant: "Jio",
    paymentMethod: "UPI",
  },
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "All" || transaction.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === "income") {
          acc.totalIncome += t.amount;
        } else {
          acc.totalExpenses += t.amount;
        }
        acc.count += 1;
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, count: 0 }
    );
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h1 className="text-2xl font-bold font-display">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage all your financial transactions
          </p>
        </div>
        <Button variant="glow" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Stats */}
      <TransactionStats 
        totalIncome={stats.totalIncome}
        totalExpenses={stats.totalExpenses}
        transactionCount={stats.count}
      />

      {/* Filters */}
      <TransactionFilters
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* Transaction List */}
      {filteredTransactions.length > 0 ? (
        <TransactionList transactions={filteredTransactions} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      )}
    </div>
  );
}
