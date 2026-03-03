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

    if (profile?.monthly_income) {
      const income = profile.monthly_income;
      const recommendedSavings = income * 0.2;
      insights.push({
        type: 'tip',
        title: language === 'ta' ? 'சேமிப்பு குறிப்பு' : 'Savings Tip',
        description: language === 'ta' 
          ? `உங்கள் வருமானத்தின் 20% சேமிக்க முயற்சிக்கவும் - மாதம் ₹${recommendedSavings.toLocaleString('en-IN')}`
          : `Try to save 20% of your income - that's ₹${recommendedSavings.toLocaleString('en-IN')}/month`,
        action: 'Set up auto-save',
      });
    }

    if (profile?.risk_profile === 'conservative') {
      insights.push({
        type: 'positive',
        title: language === 'ta' ? 'பாதுகாப்பான முதலீடுகள்' : 'Safe Investment Options',
        description: language === 'ta'
          ? 'FD மற்றும் RD உங்கள் பாதுகாப்பான சுயவிவரத்திற்கு ஏற்றது'
          : 'FD and RD are great options for your conservative profile',
        action: 'Explore FD rates',
      });
    } else if (profile?.risk_profile === 'aggressive') {
      insights.push({
        type: 'tip',
        title: language === 'ta' ? 'SIP தொடங்குங்கள்' : 'Start a SIP',
        description: language === 'ta'
          ? 'உங்கள் ரிஸ்க் சுயவிவரத்துடன், ஈக்விட்டி MF-களை கருதுங்கள்'
          : 'With your risk profile, consider equity mutual funds via SIP',
        action: 'Calculate SIP returns',
      });
    }

    if (profile?.financial_goals?.includes('emergency_fund')) {
      insights.push({
        type: 'goal',
        title: language === 'ta' ? 'அவசர நிதி இலக்கு' : 'Emergency Fund Goal',
        description: language === 'ta'
          ? '3-6 மாத செலவுகளை சேமிக்க இலக்கு வைக்கவும்'
          : 'Aim to save 3-6 months of expenses for emergencies',
        action: 'Create goal',
      });
    }

    if (profile?.financial_goals?.includes('save_tax')) {
      insights.push({
        type: 'warning',
        title: language === 'ta' ? 'வரி சேமிப்பு' : 'Tax Saving Alert',
        description: language === 'ta'
          ? '80C கீழ் ₹1.5L வரை சேமிக்கலாம். ELSS, PPF போன்றவற்றை பாருங்கள்'
          : 'You can save up to ₹1.5L under 80C. Consider ELSS, PPF, or NPS',
        action: 'View options',
      });
    }

    // Default insights if none generated
    if (insights.length === 0) {
      insights.push({
        type: 'tip',
        title: language === 'ta' ? 'FINNAVA உதவிக்குறிப்பு' : 'FINNAVA Tip',
        description: language === 'ta'
          ? 'உங்கள் செலவுகளை தொடர்ந்து பதிவு செய்யுங்கள்'
          : 'Start tracking your expenses to get personalized insights',
        action: 'Add transaction',
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
