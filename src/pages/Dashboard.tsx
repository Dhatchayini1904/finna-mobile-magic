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
  const { language } = useLanguage();
  const { profile } = useUserProfile();

  const displayName = profile?.full_name || 'there';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <h1 className="text-2xl font-bold font-display">
          {language === 'ta' ? 'டாஷ்போர்ட்' : 'Dashboard'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {language === 'ta' 
            ? `வணக்கம், ${displayName}! உங்கள் நிதி கண்ணோட்டம்` 
            : `Welcome back, ${displayName}! Here's your financial overview.`}
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

      {/* AI Insight Card */}
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        <AIInsightCard />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={language === 'ta' ? 'மாத பட்ஜெட்' : 'Monthly Budget'}
          value="₹35,000"
          change="-8.2%"
          changeType="negative"
          icon={Wallet}
          iconColor="text-primary"
          delay={100}
        />
        <StatCard
          title={language === 'ta' ? 'முதலீடுகள்' : 'Investments'}
          value="₹1,24,500"
          change="+15.3%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-success"
          delay={150}
        />
        <StatCard
          title={language === 'ta' ? 'கிரெடிட் ஸ்கோர்' : 'Credit Score'}
          value="785"
          change="+12 pts"
          changeType="positive"
          icon={CreditCard}
          iconColor="text-info"
          delay={200}
        />
        <StatCard
          title={language === 'ta' ? 'சேமிப்பு இலக்கு' : 'Savings Goal'}
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
