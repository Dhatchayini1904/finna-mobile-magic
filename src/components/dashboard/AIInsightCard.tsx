import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Target, RefreshCw, ChevronRight } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLanguage } from "@/contexts/LanguageContext";

interface Insight {
  type: 'positive' | 'warning' | 'tip' | 'goal';
  title: string;
  description: string;
  action?: string;
}

export function AIInsightCard() {
  const { profile } = useUserProfile();
  const { t, language } = useLanguage();
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate personalized insights based on profile
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // 1. Emergency Fund Logic
    if (profile?.monthly_income) {
      const income = profile.monthly_income;
      const emergencyFundTarget = income * 6;
      insights.push({
        type: 'goal',
        title: language === 'ta' ? 'அவசர நிதி இலக்கு' : 'Emergency Fund Strategy',
        description: language === 'ta'
          ? `₹${emergencyFundTarget.toLocaleString('en-IN')} சேமிக்க இலக்கு வைக்கவும். இது 6 மாத பாதுகாப்பு அளிக்கும்.`
          : `Aim for ₹${emergencyFundTarget.toLocaleString('en-IN')}. This covers 6 months of essential stability.`,
        action: 'Start Emergency Fund',
      });

      // 2. Savings Rule (50/30/20)
      const investmentBudget = income * 0.2;
      insights.push({
        type: 'tip',
        title: language === 'ta' ? '50/30/20 விதி' : 'The 50/30/20 Rule',
        description: language === 'ta'
          ? `மாதம் ₹${investmentBudget.toLocaleString('en-IN')} முதலீடு செய்ய முயற்சிக்கவும்.`
          : `Try to allocate at least ₹${investmentBudget.toLocaleString('en-IN')} per month for investments.`,
        action: 'Automate Savings',
      });
    }

    // 3. Risk-Based Portfolio Advice
    if (profile?.risk_profile === 'conservative') {
      insights.push({
        type: 'positive',
        title: language === 'ta' ? 'குறைந்த ஆபத்து வளர்ச்சி' : 'Low-Risk Growth',
        description: language === 'ta'
          ? 'தற்போதைய சந்தையில் FD மற்றும் தங்கப் பத்திரங்கள் அதிக பாதுகாப்பு தரும்.'
          : 'In the current market, Sovereign Gold Bonds and FDs offer better stability.',
        action: 'View Debt Options',
      });
    } else if (profile?.risk_profile === 'aggressive') {
      insights.push({
        type: 'tip',
        title: language === 'ta' ? 'ஈக்விட்டி வாய்ப்பு' : 'Equity Momentum',
        description: language === 'ta'
          ? 'நிஃப்டி 50 இன்டெக்ஸ் ஃபண்டுகளில் முதலீடு செய்வதை பரிசீலிக்கவும்.'
          : 'Consider allocating to Nifty 50 Index funds for long-term compounding.',
        action: 'Explore Index Funds',
      });
    }

    // 4. Inflation & Expense Alert
    insights.push({
      type: 'warning',
      title: language === 'ta' ? 'பணவீக்கம் எச்சரிக்கை' : 'Inflation Protection',
      description: language === 'ta'
        ? 'பணவீக்கத்தை மிஞ்ச உங்கள் முதலீடுகளில் 60% ஈக்விட்டியில் இருக்க வேண்டும்.'
        : 'To beat 6% inflation, ensure at least 60% of your long-term wealth is in Equities.',
      action: 'Check Real Returns',
    });

    // 5. Tax Saving (Seasonal)
    if (profile?.financial_goals?.includes('save_tax')) {
      insights.push({
        type: 'warning',
        title: language === 'ta' ? 'வரி சேமிப்பு நேரம்' : 'Tax Saving Season',
        description: language === 'ta'
          ? 'ELSS மூலம் வரி சேமிக்க இன்னும் காலம் உள்ளது. ₹1.5L வரை விலக்கு பெறலாம்.'
          : 'Save up to ₹46,800 in taxes via ELSS (80C). Don\'t wait until March!',
        action: 'Compare ELSS Funds',
      });
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        title: language === 'ta' ? 'FINNAVA உதவிக்குறிப்பு' : 'Personalization Pending',
        description: language === 'ta'
          ? 'உங்கள் சுயவிவரத்தை பூர்த்தி செய்து தனிப்பயனாக்கப்பட்ட குறிப்புகளைப் பெறுங்கள்.'
          : 'Complete your financial profile to get laser-focused AI advice.',
        action: 'Update Profile',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
      setIsRefreshing(false);
    }, 500);
  };

  const insight = insights[currentInsight];

  const getIcon = () => {
    switch (insight.type) {
      case 'positive': return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-400" />;
      case 'goal': return <Target className="h-5 w-5 text-blue-400" />;
      default: return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const getBgColor = () => {
    switch (insight.type) {
      case 'positive': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/20';
      case 'goal': return 'bg-blue-500/10 border-blue-500/20';
      default: return 'bg-primary/10 border-primary/20';
    }
  };

  return (
    <Card variant="premium" className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">
              {language === 'ta' ? 'AI நுண்ணறிவு' : 'AI Insight'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {currentInsight + 1}/{insights.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-xl border ${getBgColor()} transition-all`}>
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{insight.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
            </div>
          </div>
          {insight.action && (
            <Button variant="ghost" size="sm" className="mt-3 w-full justify-between hover:bg-background/50">
              {insight.action}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
