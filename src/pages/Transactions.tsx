import { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { FraudAnalysisView } from "@/components/transactions/FraudAnalysisView";
import { format, isToday, isYesterday } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck } from "lucide-react";

export default function Transactions() {
  const { transactions, loading, createTransaction, updateTransaction, deleteTransaction, stats } = useTransactions();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const formatDate = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d, yyyy");
  };

  const formattedTransactions = useMemo(() => {
    return transactions.map(t => ({
      id: t.id,
      description: t.description,
      category: t.category,
      amount: Number(t.amount),
      type: t.type as "income" | "expense",
      date: formatDate(t.date),
      time: t.time || "",
      icon: t.icon || "📦",
      merchant: t.merchant,
      paymentMethod: t.payment_method,
    }));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return formattedTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || transaction.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [formattedTransactions, searchQuery, selectedCategory]);

  const handleEdit = (transactionId: string) => {
    const t = transactions.find(tx => tx.id === transactionId);
    if (t) {
      setEditingTransaction(t);
      setFormOpen(true);
    }
  };

  const handleDelete = async (transactionId: string) => {
    await deleteTransaction(transactionId);
  };

  const handleSubmit = async (data: any) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
    } else {
      await createTransaction(data);
    }
    setEditingTransaction(null);
  };

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
        <Button variant="glow" className="gap-2" onClick={() => { setEditingTransaction(null); setFormOpen(true); }}>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-secondary/30 p-1 h-12 rounded-xl">
          <TabsTrigger value="history" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest">
            {t('history') || 'History'}
          </TabsTrigger>
          <TabsTrigger value="security" className="px-6 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white uppercase font-black text-[10px] tracking-widest flex gap-2">
            <ShieldCheck className="h-3 w-3" />
            Security Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Filters */}
          <TransactionFilters
            onSearch={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* Transaction List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <TransactionList
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-lg border border-border/50">
              <p className="text-muted-foreground mb-4">No transactions yet. Add your first transaction!</p>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="security">
          <FraudAnalysisView />
        </TabsContent>
      </Tabs>

      <TransactionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
