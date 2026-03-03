import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SpendingCategories } from "@/components/dashboard/SpendingCategories";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Dashboard() {
  const { t } = useLanguage();
  const { profile } = useUserProfile();

  const displayName = profile?.full_name || 'there';

  return (
    <div className="space-y-10 pb-10">
      {/* Page Header - Enhanced */}
      <div className="opacity-0 animate-fade-up flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground">
            {t('dashboard')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            {t('welcome')}, <span className="text-primary font-bold">{displayName}</span>! {t('financialOverview')}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Live Updates Active</span>
          </div>
        </div>
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

      {/* AI Insight Card */}
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <AIInsightCard />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('monthlyBudget')}
          value="₹35,000"
          change="-8.2%"
          changeType="negative"
          icon={Wallet}
          iconColor="text-primary"
          delay={100}
        />
        <StatCard
          title={t('investments')}
          value="₹1,24,500"
          change="+15.3%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          delay={150}
        />
        <StatCard
          title={t('creditScore')}
          value="785"
          change="+12 pts"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-info"
          delay={200}
        />
        <StatCard
          title={t('savingsGoal')}
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
