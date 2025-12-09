import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpendingCategories } from "@/components/dashboard/SpendingCategories";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back, John! Here's your financial overview.
        </p>
      </div>

      {/* Balance & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceCard />
        </div>
        <div className="space-y-4">
          <QuickActions />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Budget"
          value="₹35,000"
          change="-8.2%"
          changeType="negative"
          icon={Wallet}
          iconColor="text-primary"
          delay={100}
        />
        <StatCard
          title="Investments"
          value="₹1,24,500"
          change="+15.3%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          delay={150}
        />
        <StatCard
          title="Credit Score"
          value="785"
          change="+12 pts"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-info"
          delay={200}
        />
        <StatCard
          title="Savings Goal"
          value="68%"
          change="+5.2%"
          changeType="positive"
          icon={PiggyBank}
          iconColor="text-warning"
          delay={250}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <SpendingCategories />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}
