import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillsSummary } from "@/components/bills/BillsSummary";
import { BillCard } from "@/components/bills/BillCard";
import { UpcomingBills } from "@/components/bills/UpcomingBills";
import { Plus, Search, Filter } from "lucide-react";

const bills = [
  { name: "Netflix", amount: 649, dueDate: "Dec 18", category: "streaming", isRecurring: true },
  { name: "Spotify", amount: 119, dueDate: "Dec 20", category: "streaming", isRecurring: true },
  { name: "Electricity", amount: 2800, dueDate: "Dec 22", category: "utilities", isRecurring: true },
  { name: "Internet", amount: 999, dueDate: "Dec 25", category: "utilities", isRecurring: true },
  { name: "Health Insurance", amount: 5000, dueDate: "Dec 28", category: "insurance", isRecurring: true },
  { name: "Gym Membership", amount: 1500, dueDate: "Dec 30", category: "subscription", isRecurring: true },
  { name: "Amazon Prime", amount: 1499, dueDate: "Dec 15", category: "subscription", isPaid: true },
  { name: "Car Loan EMI", amount: 15000, dueDate: "Dec 5", category: "loan", isPaid: true },
  { name: "Credit Card", amount: 2999, dueDate: "Dec 10", category: "loan", isOverdue: true },
];

export default function Bills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "upcoming") return matchesSearch && !bill.isPaid && !bill.isOverdue;
    if (activeTab === "paid") return matchesSearch && bill.isPaid;
    if (activeTab === "overdue") return matchesSearch && bill.isOverdue;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">

      <BillsSummary />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card/50 border-border/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4 space-y-3">
              {filteredBills.map((bill, index) => (
                <BillCard key={index} {...bill} />
              ))}
              {filteredBills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No bills found
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <UpcomingBills />
        </div>
      </div>
    </div>
  );
}
